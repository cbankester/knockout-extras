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

export function create_observable(vm, attr_name, attr_val) {
  vm[attr_name] = _obs().extend({
    postable: attr_name,
    initial_value: attr_val
  });
  if (vm.observables_list) vm.observables_list.push(vm[attr_name]);
  return vm[attr_name];
}

export function parse_json_api_response(response, opts={}) {
  if (!response) return;

  if (response.included) opts.get_included_record = _get_included(response.included);

  if (response.data instanceof Array)
    return response.data.map(elem => _remap_with_included_records(elem, opts));
  else
    return _remap_with_included_records(response.data, opts);
}

export function create_relationship(vm, rel_name, rel_data, {get_included_record, client_defined_relationships}) {
  if (rel_data instanceof Array) {
    let arr     = vm[rel_name] || (vm[rel_name] = _arr([])),
        records = rel_data;

    if (get_included_record)
      records = records.map(rec => _remap_with_included_records(rec, {get_included_record}));

    if (client_defined_relationships) {
      let relationship = client_defined_relationships.find(r => r.name === rel_name);
      if (relationship) {
        if (relationship.allow_destroy)
          vm[`non_deleted_${rel_name}`] = _com(() => arr().filter(obj => !obj.marked_for_deletion()));

        if (relationship.nested_attributes_accepted)
          arr.extend({
            nestable: rel_name,
            initial_length: records.length,
            watch_for_pending_changes: true
          });

        if (relationship.class) {
          let klass = relationship.class;
          records = records.map(r => new klass(vm, r));

          if (relationship.blank_value)
            arr.extend({
              pushable: [relationship.class, vm, relationship.blank_value]
            });
        }
      }
    }
    arr(records);

  } else if (rel_data) {
    let obs      = vm[rel_name] || (vm[rel_name] = _obs()),
        remapped = _remap_with_included_records(rel_data, {get_included_record}),
        record;

    if (client_defined_relationships) {
      let relationship = client_defined_relationships.find(r => r.name === rel_name);
      if (relationship) {
        if (relationship.nested_attributes_accepted)
          obs.extend({
            nestable: rel_name,
            watch_for_pending_changes: true
          });
        if (relationship.class) {
          let klass = relationship.class;
          record = new klass(vm, Object.assign({}, remapped));
        }
      }
    }
    obs(record || remapped);

  } else {
    let obs = vm[rel_name] || (vm[rel_name] = _obs()),
        record;

    if (client_defined_relationships) {
      let relationship = client_defined_relationships.find(r => r.name === rel_name);

      if (relationship) {
        if (relationship.nested_attributes_accepted)
          obs.extend({
            nestable: rel_name,
            watch_for_pending_changes: true
          })
        if (relationship.class) {
          let klass       = relationship.class,
              blank_value = relationship.blank_value || {};

          record = new klass(vm, Object.assign({}, typeof blank_value === 'function' ? blank_value.call(vm) : blank_value))
        }
      }
    }
    obs(record || {});
  }

  return vm[rel_name];
}
