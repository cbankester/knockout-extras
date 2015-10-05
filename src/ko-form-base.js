const _obs           = ko.observable,
      _arr           = ko.observableArray,
      _com           = ko.computed,
      _get_included  = included => ({id, type}) => {
        return included.find(v => {
          return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
        });
      };

function _initKOFormVMFromJsonApiResponse(vm, response) {
  const record = response.data,
        client_defined_relationships = vm.options.relationships,
        server_defined_relationships = record.relationships || {},
        server_defined_attributes    = record.attributes || {},
        get_included_record          = response.included ? _get_included(response.included) : undefined;

  vm.id = record.id;
  if (vm.id) vm.id = Number.parseInt(vm.id, 10);
  vm.type = record.type;

  vm._url = vm.url = server_defined_attributes.url;
  delete server_defined_attributes.url;

  for (const key in server_defined_attributes)
    vm.observables_list.push(
      ko_extras.json_api_utils.create_observable(vm, key, server_defined_attributes[key])
    );

  const relationship_names = Object.keys(server_defined_relationships)

  return Promise.all(
    relationship_names.map(key => {
      return ko_extras.json_api_utils.init_relationship(vm, key, server_defined_relationships[key].data, client_defined_relationships);
    })
  ).then(relationship_params => Promise.all(
    relationship_params.map(({rel_name, rel_data, obs, client_defined_relationship}) => {
      vm.relationships.push(obs);
      return json_api_utils.build_relationship(vm, rel_name, rel_data, obs, {
        get_included_record,
        client_defined_relationship
      });
    })
  ));
}

function _initNestedVMs(vm, vm_map) {
  return vm_map && Promise.all([...vm_map].map(([nested_vm_name, nested_vm]) => {
    vm[nested_vm_name] = nested_vm;
    nested_vm.error_message.subscribe(vm.error_message);
    return nested_vm.doneLoading();
  })) || Promise.resolve();
}

function _sendRequests(requests) {
  return ko_extras
    .json_api_utils
    .httpJSON
    .get(requests)
    .catch(xhr => {
      throw new ko_extras.json_api_utils.RequestError(xhr);
    });
}

export default class KOFormBase {

  init(opts) {
    if (this.init_begun || this.init_finalized)
      throw new Error("Cannot init more than once");

    if (!opts.url) throw new Error("Please provide a URL");
    this.init_begun = true;
    const {url, request_opts, other_requests} = this.options = opts;
    const requests = [
            {url, data: Object.assign({}, request_opts)},
            ...(other_requests || []).map(req => {
              return typeof req === 'string' ? {url: req, data: {}} : {
                url: req.url,
                data: Object.assign({}, req.request_opts)
              };
            })
          ];
    return Promise.all([
      _sendRequests(requests),
      _initNestedVMs(this, opts.nested_vms)
    ])
    .then(([[main_response, ...other_responses]]) => {
      return _initKOFormVMFromJsonApiResponse(this, main_response)
        .then(() => Promise.all([
          other_responses.length && this.handleOtherRequests(other_responses) || Promise.resolve(),
          this.finalizeInit()
        ]));
    })
    .then(() => delete this.init_begun);
  }

  handleOtherRequests(responses) {
    // Overload this method to handle responses
  }

  finalizeInit() {
    if (this.init_finalizing || this.init_finalized)
      throw new Error("Cannot finalize init more than once");

    this.init_finalizing = true;
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
    delete this.init_finalizing;
    this.init_finalized = true;
  }

  constructor() {
    Object.assign(this, {
      loading:          _obs(true),
      attempted:        _obs(false),
      error_message:    _obs(null),
      observables_list: [],
      relationships:    []
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
    return new Promise((resolve, reject) => {
      this.attempted(true);
      const numErrors = this.numErrors();
      if (numErrors) {
        reject(`There ${numErrors === 1 ? "is 1 error which prevents" : `are ${numErrors} errors which prevent`} this form from being submitted.`);
        return;
      }

      ko_extras.json_api_utils.httpJSON[this.id ? 'patch' : 'post']({
        url: this.url,
        data: {
          data: {
            id:         this.id,
            type:       this.type,
            attributes: this.serialize()
          }
        }
      })
      .then(response => {
        const record = ko_extras.json_api_utils.parse_json_api_response(response);
        if (record) {
          this.id  = record.id;
          this.url = record.url;
        }
        resolve(record);
      })
      .catch(xhr => reject(new ko_extras.json_api_utils.RequestError(xhr)));
    });
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
    delete this.id;
    this.url = this._url;
    this.observables_list.forEach(obs => obs('push' in obs ? [] : undefined));
    this.attempted(false);
  }

  doneLoading() {
    return this.loading() && new Promise((resolve, reject) => {
      let e, l;
      e = this.error_message.subscribe(err => {
        l.dispose()
        e.dispose();
        reject(err);
      });
      l = this.loading.subscribe(() => {
        l.dispose();
        e.dispose();
        if (this.error_message()) reject(this.error_message());
        else resolve();
      });
    }) || Promise.resolve();
  }
}
