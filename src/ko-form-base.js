const _obs = ko.observable,
      _arr = ko.observableArray,
      _com = ko.computed,
      _get_included = included => ({id, type}) => {
        return included.find(v => {
          return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
        });
      };

const _encode_uri = function _encode_uri(url, obj) {
  if (Object.keys(obj).length === 0) return url;
  let str = "";
  for (let key in obj) {
    if (str !== "") str += "&";
    str += `${key}=${encodeURIComponent(obj[key])}`
  }
  return `${url}?${str}`
};

const _base_request = function _base_request(resolve, reject) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === 4) // done
      if (this.status === 200)
        resolve(JSON.parse(this.response || "null"));
      else
        reject(this);
  };
  request.onerror = function() {
    reject(this);
  };
  return request;
};

class RequestError extends Error {
  constructor(xhr) {
    let message, errors_from_server,
        name = "RequestError",
        json = JSON.parse(xhr.responseText || "null");

    if (json && json.errors) {
      errors_from_server = json.errors;
      if (json.errors.length === 1) message = json.errors[0].title;
    }
    if (!message) message = xhr.statusText || "An error occurred while sending the request";
    super(message);
    this.message = message;
    this.name    = name;
    this.status  = xhr.status
    if (errors_from_server) this.errors_from_server = errors_from_server;
  }
}

export default class KOFormBase {
  beginInit(opts) {
    return new Promise((resolve, reject) => {
      if (!this.init_begun && !this.init_finalized) {
        this.options = opts;
        const {url, request_opts, other_requests} = opts;
        if (!url) throw new Error("Please provide a URL");
        const requests = [
                {url, data: Object.assign({}, request_opts)},
                ...(other_requests || []).map(req => {
                  return typeof req === 'string' ? {url: req, data: {}} : {
                    url: req.url,
                    data: Object.assign({}, req.request_opts)
                  };
                })
              ];
        this.httpJSON.get(requests)
        .then(([main_response, ...other_responses]) => {
          return this.init(main_response).then(() => Promise.all([
            this.handleOtherRequests(other_responses),
            Promise.resolve()
          ]));
        })
        .then(resolve).catch(reject);
      } else throw new Error("Cannot begin init more than once");
    });
  }

  init(response) {
    const record = response.data,
          client_defined_relationships = this.options.relationships,
          server_defined_relationships = record.relationships || {},
          server_defined_attributes    = record.attributes || {},
          get_included_record          = response.included ? _get_included(response.included) : undefined;

    this.id = record.id;
    if (this.id) this.id = Number.parseInt(this.id, 10);
    this.type = record.type;

    this.url = server_defined_attributes.url;
    delete server_defined_attributes.url;

    for (const key in server_defined_attributes)
      this.observables_list.push(
        ko_extras.json_api_utils.create_observable(
          this,
          key,
          server_defined_attributes[key]
        )
      );

    const relationship_names = Object.keys(server_defined_relationships)

    return Promise.all(
      relationship_names.map(key => {
        return ko_extras.json_api_utils.init_relationship(this, key, server_defined_relationships[key].data, client_defined_relationships);
      })
    ).then(relationship_params => Promise.all(
      relationship_params.map(({rel_name, rel_data, obs, client_defined_relationship}) => {
        this.relationships.push(obs);
        return ko_extras.json_api_utils.build_relationship(this, rel_name, rel_data, obs, {
          get_included_record,
          client_defined_relationship
        });
      })
    ));
  }

  finalizeInit() {
    return new Promise(resolve => {
      if (!this.init_finalized) {
        const errorable = this.observables_list.filter(obs => obs.hasError),
              observables_with_initial_values = this.observables_list.filter(obs => {
                return obs.initial_value || obs.initial_length;
              });
        this.errors = {};
        errorable.forEach(obs => {
          if (obs.postable_name)
            this.errors[obs.postable_name] = _com(() => {
              return obs.hasError() ? obs.validationMessage() : null
            });
          else if (obs.errorable_observables)
            this.errors[obs.errorable_name] = _com(() => {
              return obs.hasError() ? obs.errors() : null
            });
        });
        this.numErrors = this.numErrors || _com(() => {
          return errorable.reduce(((total, obs) => {
            return total + (obs.hasError() ? (obs.numErrors ? obs.numErrors() : 1) : 0);
          }), 0);
        });

        this.is_valid = _com(() => {
          let is_valid = this.numErrors() === 0;
          if (is_valid) {
            if (this.validation_messenger) {
              this.validation_messenger.cancel();
              delete this.validation_messenger;
            }
          }
          return is_valid;
        }).extend({notify: 'always'});

        this.no_changes_pending = _com(() => {
          const relationships_pendings = this.relationships.map(obs => {
                  const c = obs.no_changes_pending,
                        l = obs.initial_length;

                  return (c ? c() : true) && (l ? l() === obs().length : true);
                }),
                observable_value_pairs = observables_with_initial_values.map(obs => {
                  return obs.initial_value ? obs() === obs.initial_value() : obs().length === obs.initial_length();
                });

          return relationships_pendings.every(p => p) && observable_value_pairs.every(p => p);
        }).extend({notify: 'always'});

        this.changes_pending = _com(() => !this.no_changes_pending()).extend({notify: 'always'});

        if (this.options.save_after_edit) {
          const reify_method = this.options.save_after_edit.reify_method;
          const should_save = _com(() => {
            const [changes_pending, is_valid] = [this.changes_pending(), this.is_valid()];
            return changes_pending && (this.id || is_valid);
          }).extend({
            rateLimit: {
              method: 'notifyWhenChangesStop',
              timeout: this.options.save_after_edit.rate_limit || 500
            },
            notify: 'always'
          });

          this.saving_locked = false;

          should_save.subscribe(should => {
            if (should && !this.saving_locked) {
              this.save()
              .then(record => {
                if (reify_method) this[reify_method](record);
              })
              .catch(err => {
                if (typeof err === 'string')
                  this.validation_messenger = errorNotice({notice: err, id: 'validation'});
                else {
                  this.saving_locked = true;
                  this.error_message(err);
                }
              });
            }
          });
        }
        this.init_finalized = true;
      } else throw new Error("Cannot finalize init more than once");
      resolve();
    });
  }

  handleOtherRequests(responses) {
    // Overload this method to handle responses
    return Promise.resolve();
  }

  constructor() {
    Object.assign(this, {
      loading:          _obs(true),
      attempted:        _obs(false),
      error_message:    _obs(null),
      observables_list: [],
      relationships:    [],
      httpJSON:         ko_extras.json_api_utils.httpJSON
    });
  }

  saveAndReload() {
    let action = this.id ? 'update' : 'create';
    this.save()
    .then(record => {
      successNotice({notice: `Record ${action}d`});
      window.location = record && record.url ? record.url : this.url;
    }).catch(err => {
      if (typeof err === 'string')
        this.validation_messenger = errorNotice({notice: err, id: 'validation'});
      else if (err instanceof Error) {
        console.log(err);
        errorNotice({notice: err.message});
      }
    });
  }


  save() {
    this.attempted(true);
    if (this.numErrors() !== 0)
      return Promise.reject(`There ${this.numErrors() === 1 ? "is 1 error which prevents" : `are ${this.numErrors()} errors which prevent`} this form from being submitted.`);
    let data = {
          id:         this.id,
          type:       this.type,
          attributes: this.serialize()
        };
    return this.httpJSON[this.id ? 'patch' : 'post']({url: this.url, data: {data}})
      .then(response => {
        let record = ko_extras.json_api_utils.parse_json_api_response(response);
        if (record) {
          this.id  = record.id;
          this.url = record.url;
        }
        return Promise.resolve(record);
      })
      .catch(xhr => Promise.reject(new RequestError(xhr)));
  }

  serialize() {
    let json = {};
    this.observables_list.forEach(obs => {
      let pname = obs.postable_name,
          nname = obs.nestable_name,
          val   = obs();

      if (pname)
        json[pname] = val instanceof Date ? val.toISOString() : val;
      else if (nname)
        json[nname] = obs.initial_length ? val.map(_serialize) : val.serialize();
    });

    this.relationships.forEach(obs => {
      let nname = obs.nestable_name,
          val   = obs();
      if (nname)
        json[nname] = obs.initial_length ? val.map(_serialize) : val.serialize();
    });
    return json;
  }

  unsetObservables() {
    this.observables_list.forEach(obs => obs('push' in obs ? [] : undefined));
    this.attempted(false);
  }

  doneLoading() {
    if (this.loading())
      return new Promise(resolve => {
        const s = this.loading.subscribe(() => {
          s.dispose();
          resolve();
        });
      });
    else return Promise.resolve();
  }
}
