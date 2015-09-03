if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

const _obs = ko.observable,
      _arr = ko.observableArray,
      _com = ko.computed,
      _get_included = included => ({id, type}) => {
        return included.find(v => {
          return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
        });
      },
      _build_relationship = (vm, get_included_record) => ({rel_name, rel_data, client_defined_relationship, obs}) => {
        return build_relationship(vm, rel_name, rel_data, obs, {
          client_defined_relationship,
          get_included_record
        });
      },
      _init_relationship = (vm, client_defined_relationships) => ([rel_name, rel_data]) => {
        return init_relationship(vm, rel_name, rel_data, client_defined_relationships);
      };

function _remap_with_included_records(record, {get_included_record, immybox, nested_immybox_relationships}={}) {
  let ret = get_included_record ? (get_included_record(record) || record) : record;

  Object.assign(ret, ret.attributes, {id: Number.parseInt(ret.id, 10), type: ret.type});

  if (ret.relationships) {
    let {relationships} = ret;
    for (const relationship_name in relationships) {
      let relationship = relationships[relationship_name],
          {data}       = relationship,
          opts         = {
            get_included_record,
            nested_immybox_relationships,
            immybox: (nested_immybox_relationships || []).includes(relationship_name)
          };
      if (data instanceof Array)
        ret[relationship_name] = data.map(item => _remap_with_included_records(item, opts));
      else if (data)
        ret[relationship_name] = _remap_with_included_records(data, opts);
      else
        ret[relationship_name] = null;
    }
  }

  if (immybox)
    Object.assign(ret, {
      value: ret[immybox.value || 'id'],
      text: ret[immybox.text || 'name']
    });

  return ret;
}

function _base_request(resolve, reject) {
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
}

export const httpJSON = {
  get(req) {
    if (req instanceof Array)
      return Promise.all(req.map(elem => httpJSON.get(elem)));
    if (typeof req === 'string')
      return httpJSON.get({url: req});
    const {url, data} = req;
    return new Promise((resolve, reject) => {
      let request = _base_request(resolve, reject);
      request.open('GET', _encode_uri(url, Object.assign({}, data)));
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Accept', 'application/json');
      if (document.querySelector('[name="csrf-token"]')) {
        const token = document.querySelector('[name="csrf-token"]').getAttribute('content');
        if (token) request.setRequestHeader('X-CSRF-Token', token);
      }
      request.send();
    });
  },
  post(req) {
    if (req instanceof Array)
      return Promise.all(req.map(elem => httpJSON.post(elem)));
    const {url, data} = req;
    return new Promise((resolve, reject) => {
      let request = _base_request(resolve, reject);
      request.open('POST', url);
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Accept', 'application/json');
      if (document.querySelector('[name="csrf-token"]')) {
        const token = document.querySelector('[name="csrf-token"]').getAttribute('content');
        if (token) request.setRequestHeader('X-CSRF-Token', token);
      }
      request.send(JSON.stringify(data));
    });
  },
  patch(req) {
    if (req instanceof Array)
      return Promise.all(req.map(elem => httpJSON.patch(elem)));
    const {url, data} = req;
    return new Promise((resolve, reject) => {
      let request = _base_request(resolve, reject);
      request.open('PATCH', url);
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Accept', 'application/json');
      if (document.querySelector('[name="csrf-token"]')) {
        const token = document.querySelector('[name="csrf-token"]').getAttribute('content');
        if (token) request.setRequestHeader('X-CSRF-Token', token);
      }
      request.send(JSON.stringify(data));
    });
  },
  delete(req) {
    if (req instanceof Array)
      return Promise.all(req.map(elem => httpJSON.patch(elem)));
    if (typeof req === 'string')
      return httpJSON.delete({url: req});
    const {url} = req;
    return new Promise((resolve, reject) => {
      let request = _base_request(resolve, reject);
      request.open('DELETE', _encode_uri(url, Object.assign({}, data)));
      if (document.querySelector('[name="csrf-token"]')) {
        const token = document.querySelector('[name="csrf-token"]').getAttribute('content');
        if (token) request.setRequestHeader('X-CSRF-Token', token);
      }
      request.send();
    });
  }
};

export function create_observable(vm, attr_name, attr_val) {
  return vm[attr_name] = _obs().extend({
    postable: attr_name,
    initial_value: attr_val
  });
}

export function parse_json_api_response(response, opts={}) {
  if (!response) return;

  if (response.included) opts.get_included_record = _get_included(response.included);

  if (response.data instanceof Array)
    return response.data.map(elem => _remap_with_included_records(elem, opts));
  else
    return _remap_with_included_records(response.data, opts);
}

export function init_relationship(vm, rel_name, rel_data, client_defined_relationships=[]) {
  const client_defined_relationship = client_defined_relationships.find(r => {
    return r.name === rel_name;
  });
  const obs = vm[rel_name] || (vm[rel_name] = (rel_data instanceof Array ? _arr([]) : _obs()));

  if (client_defined_relationship && client_defined_relationship.allow_destroy)
    vm[`non_deleted_${rel_name}`] = _com(() => {
      return obs().filter(obj => {
        return obj.loading ? (!obj.loading() && !obj.marked_for_deletion()) : !obj.marked_for_deletion();
      });
    });

  return Promise.resolve({rel_name, rel_data, client_defined_relationship, obs});
}
export function build_relationship(vm, rel_name, rel_data, obs, {client_defined_relationship, get_included_record}={}) {
  let done = Promise.resolve();
  if (rel_data instanceof Array) {
    let records = rel_data;

    if (get_included_record)
      records = records.map(rec => _remap_with_included_records(rec, {get_included_record}));

    if (client_defined_relationship) {
      if (client_defined_relationship.nested_attributes_accepted)
        obs.extend({
          nestable: rel_name,
          initial_length: records.length,
          watch_for_pending_changes: true
        });

      if (client_defined_relationship.class) {
        const klass = client_defined_relationship.class;

        records = records.map(r => new klass(vm, r));

        if (klass.prototype.doneLoading) done = Promise.all(records.map(r => r.doneLoading()));

        if (client_defined_relationship.blank_value)
          obs.extend({
            pushable: [klass, vm, client_defined_relationship.blank_value]
          });
      }
    }
    obs(records);

  } else if (rel_data) {
    let remapped = _remap_with_included_records(rel_data, {get_included_record}),
        record;

    if (client_defined_relationship) {
      if (client_defined_relationship.nested_attributes_accepted)
        obs.extend({
          nestable: rel_name,
          watch_for_pending_changes: true
        });
      if (client_defined_relationship.class) {
        const klass = client_defined_relationship.class;
        record = new klass(vm, Object.assign({}, remapped));

        if (klass.prototype.doneLoading) done = record.doneLoading();
      }
    }
    obs(record || remapped);

  } else {
    let record;

    if (client_defined_relationship) {
      if (client_defined_relationship.nested_attributes_accepted)
        obs.extend({
          nestable: rel_name,
          watch_for_pending_changes: true
        })
      if (client_defined_relationship.class) {
        const klass       = client_defined_relationship.class,
              blank_value = client_defined_relationship.blank_value || {};

        record = new klass(vm, Object.assign({}, typeof blank_value === 'function' ? blank_value.call(vm) : blank_value))

        if (klass.prototype.doneLoading) done = record.doneLoading();
      }
    }
    obs(record || {});
  }
  return done.then(() => obs());
}

export function create_relationships(vm, relationships_map, {get_included_record, client_defined_relationships}={}) {
  return Promise.all(
    [...relationships_map].map(_init_relationship(vm, client_defined_relationships))
  )
  .then(resolutions => Promise.all(
    resolutions.map(_build_relationship(vm, get_included_record))
  ));
}

export function create_relationship(vm, rel_name, rel_data, {get_included_record, client_defined_relationships}={}) {
  return init_relationship(vm, rel_name, rel_data, client_defined_relationships)
  .then(_build_relationship(vm, get_included_record));
}
