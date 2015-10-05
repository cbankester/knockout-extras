/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	__webpack_require__(1);
	
	var _jsonApiUtils = __webpack_require__(2);
	
	var json_api_utils = _interopRequireWildcard(_jsonApiUtils);
	
	var _koFormBase = __webpack_require__(3);
	
	var _koFormBase2 = _interopRequireDefault(_koFormBase);
	
	window.ko_extras = {};
	
	Object.assign(window.ko_extras, { json_api_utils: json_api_utils, KOFormBase: _koFormBase2['default'] });

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	if (!Array.prototype.includes) {
	  Array.prototype.includes = function (searchElement /*, fromIndex*/) {
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
	      if (k < 0) {
	        k = 0;
	      }
	    }
	    var currentElement;
	    while (k < len) {
	      currentElement = O[k];
	      if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
	        return true;
	      }
	      k++;
	    }
	    return false;
	  };
	}
	
	if (!Object.assign) {
	  Object.defineProperty(Object, 'assign', {
	    enumerable: false,
	    configurable: true,
	    writable: true,
	    value: function value(target) {
	      'use strict';
	      if (target === undefined || target === null) {
	        throw new TypeError('Cannot convert first argument to object');
	      }
	
	      var to = Object(target);
	      for (var i = 1; i < arguments.length; i++) {
	        var nextSource = arguments[i];
	        if (nextSource === undefined || nextSource === null) {
	          continue;
	        }
	        nextSource = Object(nextSource);
	
	        var keysArray = Object.keys(Object(nextSource));
	        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	          var nextKey = keysArray[nextIndex];
	          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	          if (desc !== undefined && desc.enumerable) {
	            to[nextKey] = nextSource[nextKey];
	          }
	        }
	      }
	      return to;
	    }
	  });
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	exports.create_observable = create_observable;
	exports.parse_json_api_response = parse_json_api_response;
	exports.init_relationship = init_relationship;
	exports.build_relationship = build_relationship;
	exports.create_relationships = create_relationships;
	exports.create_relationship = create_relationship;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _obs = ko.observable,
	    _arr = ko.observableArray,
	    _com = ko.computed,
	    _get_included = function _get_included(included) {
	  return function (_ref) {
	    var id = _ref.id;
	    var type = _ref.type;
	
	    return included.find(function (v) {
	      return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
	    });
	  };
	},
	    _build_relationship = function _build_relationship(vm, get_included_record) {
	  return function (_ref2) {
	    var rel_name = _ref2.rel_name;
	    var rel_data = _ref2.rel_data;
	    var client_defined_relationship = _ref2.client_defined_relationship;
	    var obs = _ref2.obs;
	
	    return build_relationship(vm, rel_name, rel_data, obs, {
	      client_defined_relationship: client_defined_relationship,
	      get_included_record: get_included_record
	    });
	  };
	},
	    _init_relationship = function _init_relationship(vm, client_defined_relationships) {
	  return function (_ref3) {
	    var _ref32 = _slicedToArray(_ref3, 2);
	
	    var rel_name = _ref32[0];
	    var rel_data = _ref32[1];
	
	    return init_relationship(vm, rel_name, rel_data, client_defined_relationships);
	  };
	};
	
	function _remap_with_included_records(record) {
	  var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var get_included_record = _ref4.get_included_record;
	  var immybox = _ref4.immybox;
	  var nested_immybox_relationships = _ref4.nested_immybox_relationships;
	
	  var ret = get_included_record ? get_included_record(record) || record : record;
	
	  Object.assign(ret, ret.attributes, { id: Number.parseInt(ret.id, 10), type: ret.type });
	
	  if (ret.relationships) {
	    var relationships = ret.relationships;
	
	    var _loop = function (relationship_name) {
	      var relationship = relationships[relationship_name];
	      var data = relationship.data;
	      var opts = {
	        get_included_record: get_included_record,
	        nested_immybox_relationships: nested_immybox_relationships,
	        immybox: (nested_immybox_relationships || []).includes(relationship_name)
	      };
	      if (data instanceof Array) ret[relationship_name] = data.map(function (item) {
	        return _remap_with_included_records(item, opts);
	      });else if (data) ret[relationship_name] = _remap_with_included_records(data, opts);else ret[relationship_name] = null;
	    };
	
	    for (var relationship_name in relationships) {
	      _loop(relationship_name);
	    }
	  }
	
	  if (immybox) Object.assign(ret, {
	    value: ret[immybox.value || 'id'],
	    text: ret[immybox.text || 'name']
	  });
	
	  return ret;
	}
	
	function _encode_uri(url, obj) {
	  if (Object.keys(obj).length === 0) return url;
	  var str = "";
	  for (var key in obj) {
	    if (str !== "") str += "&";
	    str += key + '=' + encodeURIComponent(obj[key]);
	  }
	  return url + '?' + str;
	}
	
	function _base_request(resolve, reject) {
	  var request = new XMLHttpRequest();
	  request.onreadystatechange = function () {
	    if (this.readyState === 4) // done
	      if (this.status >= 200 && this.status < 400) try {
	        resolve(JSON.parse(this.response || "null"));
	      } catch (e) {
	        resolve(null);
	      } else reject(this);
	  };
	  request.onerror = function () {
	    reject(this);
	  };
	  return request;
	}
	
	var RequestError = (function (_Error) {
	  _inherits(RequestError, _Error);
	
	  function RequestError(xhr) {
	    _classCallCheck(this, RequestError);
	
	    var message = undefined,
	        errors_from_server = undefined,
	        name = "RequestError",
	        json = undefined,
	        responseText = undefined;
	
	    try {
	      json = JSON.parse(xhr.responseText || "null");
	    } catch (e) {
	      json = null;
	    } finally {
	      if (xhr.responseText) responseText = xhr.responseText;
	    }
	
	    if (json && json.errors) {
	      errors_from_server = json.errors;
	      if (json.errors.length === 1) message = json.errors[0].title;
	    }
	    if (!message) message = xhr.statusText || "An error occurred while sending the request";
	    _get(Object.getPrototypeOf(RequestError.prototype), 'constructor', this).call(this, message);
	    this.message = message;
	    this.name = name;
	    this.status = xhr.status;
	    if (errors_from_server) this.errors_from_server = errors_from_server;
	    if (responseText) this.responseText = responseText;
	  }
	
	  return RequestError;
	})(Error);
	
	exports.RequestError = RequestError;
	var httpJSON = {
	  get: function get(req) {
	    if (req instanceof Array) return Promise.all(req.map(function (elem) {
	      return httpJSON.get(elem);
	    }));
	    if (typeof req === 'string') return httpJSON.get({ url: req });
	    var url = req.url;
	    var data = req.data;
	
	    return new Promise(function (resolve, reject) {
	      var request = _base_request(resolve, reject);
	      request.open('GET', _encode_uri(url, Object.assign({}, data)));
	      request.setRequestHeader('Content-Type', 'application/json');
	      request.setRequestHeader('Accept', 'application/json');
	      if (document.querySelector('[name="csrf-token"]')) {
	        var token = document.querySelector('[name="csrf-token"]').getAttribute('content');
	        if (token) request.setRequestHeader('X-CSRF-Token', token);
	      }
	      request.send();
	    });
	  },
	  post: function post(req) {
	    if (req instanceof Array) return Promise.all(req.map(function (elem) {
	      return httpJSON.post(elem);
	    }));
	    var url = req.url;
	    var data = req.data;
	
	    return new Promise(function (resolve, reject) {
	      var request = _base_request(resolve, reject);
	      request.open('POST', url);
	      request.setRequestHeader('Content-Type', 'application/json');
	      request.setRequestHeader('Accept', 'application/json');
	      if (document.querySelector('[name="csrf-token"]')) {
	        var token = document.querySelector('[name="csrf-token"]').getAttribute('content');
	        if (token) request.setRequestHeader('X-CSRF-Token', token);
	      }
	      request.send(JSON.stringify(data));
	    });
	  },
	  patch: function patch(req) {
	    if (req instanceof Array) return Promise.all(req.map(function (elem) {
	      return httpJSON.patch(elem);
	    }));
	    var url = req.url;
	    var data = req.data;
	
	    return new Promise(function (resolve, reject) {
	      var request = _base_request(resolve, reject);
	      request.open('PATCH', url);
	      request.setRequestHeader('Content-Type', 'application/json');
	      request.setRequestHeader('Accept', 'application/json');
	      if (document.querySelector('[name="csrf-token"]')) {
	        var token = document.querySelector('[name="csrf-token"]').getAttribute('content');
	        if (token) request.setRequestHeader('X-CSRF-Token', token);
	      }
	      request.send(JSON.stringify(data));
	    });
	  },
	  'delete': function _delete(req) {
	    if (req instanceof Array) return Promise.all(req.map(function (elem) {
	      return httpJSON.patch(elem);
	    }));
	    if (typeof req === 'string') return httpJSON['delete']({ url: req });
	    var url = req.url;
	    var data = req.data;
	
	    return new Promise(function (resolve, reject) {
	      var request = _base_request(resolve, reject);
	      request.open('DELETE', _encode_uri(url, Object.assign({}, data)));
	      if (document.querySelector('[name="csrf-token"]')) {
	        var token = document.querySelector('[name="csrf-token"]').getAttribute('content');
	        if (token) request.setRequestHeader('X-CSRF-Token', token);
	      }
	      request.send();
	    });
	  }
	};
	
	exports.httpJSON = httpJSON;
	
	function create_observable(vm, attr_name, attr_val) {
	  return vm[attr_name] = _obs().extend({
	    postable: attr_name,
	    initial_value: attr_val
	  });
	}
	
	function parse_json_api_response(response) {
	  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (!response) return;
	
	  if (response.included) opts.get_included_record = _get_included(response.included);
	
	  if (response.data instanceof Array) return response.data.map(function (elem) {
	    return _remap_with_included_records(elem, opts);
	  });else return _remap_with_included_records(response.data, opts);
	}
	
	function init_relationship(vm, rel_name, rel_data) {
	  var client_defined_relationships = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
	
	  var client_defined_relationship = client_defined_relationships.find(function (r) {
	    return r.name === rel_name;
	  });
	  var obs = vm[rel_name] || (vm[rel_name] = rel_data instanceof Array ? _arr([]) : _obs());
	
	  if (client_defined_relationship && client_defined_relationship.allow_destroy) vm['non_deleted_' + rel_name] = _com(function () {
	    return obs().filter(function (obj) {
	      return obj.loading ? !obj.loading() && !obj.marked_for_deletion() : !obj.marked_for_deletion();
	    });
	  });
	
	  return Promise.resolve({ rel_name: rel_name, rel_data: rel_data, client_defined_relationship: client_defined_relationship, obs: obs });
	}
	
	function build_relationship(vm, rel_name, rel_data, obs) {
	  var _ref5 = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
	
	  var client_defined_relationship = _ref5.client_defined_relationship;
	  var get_included_record = _ref5.get_included_record;
	
	  var done = Promise.resolve();
	  if (rel_data instanceof Array) {
	    var records = rel_data;
	
	    if (get_included_record) records = records.map(function (rec) {
	      return _remap_with_included_records(rec, { get_included_record: get_included_record });
	    });
	
	    if (client_defined_relationship) {
	      if (client_defined_relationship.nested_attributes_accepted) obs.extend({
	        nestable: rel_name,
	        initial_length: records.length,
	        watch_for_pending_changes: true
	      });
	
	      if (client_defined_relationship['class']) {
	        (function () {
	          var klass = client_defined_relationship['class'];
	
	          records = records.map(function (r) {
	            return new klass(vm, r);
	          });
	
	          if (klass.prototype.doneLoading) done = Promise.all(records.map(function (r) {
	            return r.doneLoading();
	          }));
	
	          if (client_defined_relationship.blank_value) obs.extend({
	            pushable: [klass, vm, client_defined_relationship.blank_value]
	          });
	        })();
	      }
	    }
	    obs(records);
	  } else if (rel_data) {
	    var remapped = _remap_with_included_records(rel_data, { get_included_record: get_included_record }),
	        record = undefined;
	
	    if (client_defined_relationship) {
	      if (client_defined_relationship.nested_attributes_accepted) obs.extend({
	        nestable: rel_name,
	        watch_for_pending_changes: true
	      });
	      if (client_defined_relationship['class']) {
	        var klass = client_defined_relationship['class'];
	        record = new klass(vm, Object.assign({}, remapped));
	
	        if (klass.prototype.doneLoading) done = record.doneLoading();
	      }
	    }
	    obs(record || remapped);
	  } else {
	    var record = undefined;
	
	    if (client_defined_relationship) {
	      if (client_defined_relationship.nested_attributes_accepted) obs.extend({
	        nestable: rel_name,
	        watch_for_pending_changes: true
	      });
	      if (client_defined_relationship['class']) {
	        var klass = client_defined_relationship['class'],
	            blank_value = client_defined_relationship.blank_value || {};
	
	        record = new klass(vm, Object.assign({}, typeof blank_value === 'function' ? blank_value.call(vm) : blank_value));
	
	        if (klass.prototype.doneLoading) done = record.doneLoading();
	      }
	    }
	    obs(record || {});
	  }
	  return done.then(function () {
	    return obs();
	  });
	}
	
	function create_relationships(vm, relationships_map) {
	  var _ref6 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  var get_included_record = _ref6.get_included_record;
	  var client_defined_relationships = _ref6.client_defined_relationships;
	
	  return Promise.all([].concat(_toConsumableArray(relationships_map)).map(_init_relationship(vm, client_defined_relationships))).then(function (resolutions) {
	    return Promise.all(resolutions.map(_build_relationship(vm, get_included_record)));
	  });
	}
	
	function create_relationship(vm, rel_name, rel_data) {
	  var _ref7 = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
	  var get_included_record = _ref7.get_included_record;
	  var client_defined_relationships = _ref7.client_defined_relationships;
	
	  return init_relationship(vm, rel_name, rel_data, client_defined_relationships).then(_build_relationship(vm, get_included_record));
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _obs = ko.observable,
	    _arr = ko.observableArray,
	    _com = ko.computed,
	    _get_included = function _get_included(included) {
	  return function (_ref) {
	    var id = _ref.id;
	    var type = _ref.type;
	
	    return included.find(function (v) {
	      return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
	    });
	  };
	};
	
	function _initKOFormVMFromJsonApiResponse(vm, response) {
	  var record = response.data,
	      client_defined_relationships = vm.options.relationships,
	      server_defined_relationships = record.relationships || {},
	      server_defined_attributes = record.attributes || {},
	      get_included_record = response.included ? _get_included(response.included) : undefined;
	
	  vm.id = record.id;
	  if (vm.id) vm.id = Number.parseInt(vm.id, 10);
	  vm.type = record.type;
	
	  vm._url = vm.url = server_defined_attributes.url;
	  delete server_defined_attributes.url;
	
	  for (var key in server_defined_attributes) {
	    vm.observables_list.push(ko_extras.json_api_utils.create_observable(vm, key, server_defined_attributes[key]));
	  }var relationship_names = Object.keys(server_defined_relationships);
	
	  return Promise.all(relationship_names.map(function (key) {
	    return ko_extras.json_api_utils.init_relationship(vm, key, server_defined_relationships[key].data, client_defined_relationships);
	  })).then(function (relationship_params) {
	    return Promise.all(relationship_params.map(function (_ref2) {
	      var rel_name = _ref2.rel_name;
	      var rel_data = _ref2.rel_data;
	      var obs = _ref2.obs;
	      var client_defined_relationship = _ref2.client_defined_relationship;
	
	      vm.relationships.push(obs);
	      return json_api_utils.build_relationship(vm, rel_name, rel_data, obs, {
	        get_included_record: get_included_record,
	        client_defined_relationship: client_defined_relationship
	      });
	    }));
	  });
	}
	
	function _initNestedVMs(vm, vm_map) {
	  return vm_map && Promise.all([].concat(_toConsumableArray(vm_map)).map(function (_ref3) {
	    var _ref32 = _slicedToArray(_ref3, 2);
	
	    var nested_vm_name = _ref32[0];
	    var nested_vm = _ref32[1];
	
	    vm[nested_vm_name] = nested_vm;
	    nested_vm.error_message.subscribe(vm.error_message);
	    return nested_vm.doneLoading();
	  })) || Promise.resolve();
	}
	
	function _sendRequests(requests) {
	  return ko_extras.json_api_utils.httpJSON.get(requests)["catch"](function (xhr) {
	    throw new ko_extras.json_api_utils.RequestError(xhr);
	  });
	}
	
	var KOFormBase = (function () {
	  _createClass(KOFormBase, [{
	    key: "init",
	    value: function init(opts) {
	      var _this = this;
	
	      if (this.init_begun || this.init_finalized) throw new Error("Cannot init more than once");
	
	      if (!opts.url) throw new Error("Please provide a URL");
	      this.init_begun = true;
	
	      var _options = this.options = opts;
	
	      var url = _options.url;
	      var request_opts = _options.request_opts;
	      var other_requests = _options.other_requests;
	
	      var requests = [{ url: url, data: Object.assign({}, request_opts) }].concat(_toConsumableArray((other_requests || []).map(function (req) {
	        return typeof req === 'string' ? { url: req, data: {} } : {
	          url: req.url,
	          data: Object.assign({}, req.request_opts)
	        };
	      })));
	      return Promise.all([_sendRequests(requests), _initNestedVMs(this, opts.nested_vms)]).then(function (_ref4) {
	        var _ref42 = _slicedToArray(_ref4, 1);
	
	        var _ref42$0 = _toArray(_ref42[0]);
	
	        var main_response = _ref42$0[0];
	
	        var other_responses = _ref42$0.slice(1);
	
	        return _initKOFormVMFromJsonApiResponse(_this, main_response).then(function () {
	          return Promise.all([other_responses.length && _this.handleOtherRequests(other_responses) || Promise.resolve(), _this.finalizeInit()]);
	        });
	      }).then(function () {
	        return delete _this.init_begun;
	      });
	    }
	  }, {
	    key: "handleOtherRequests",
	    value: function handleOtherRequests(responses) {
	      // Overload this method to handle responses
	    }
	  }, {
	    key: "finalizeInit",
	    value: function finalizeInit() {
	      var _this2 = this;
	
	      if (this.init_finalizing || this.init_finalized) throw new Error("Cannot finalize init more than once");
	
	      this.init_finalizing = true;
	      var errorable = this.observables_list.filter(function (obs) {
	        return obs.hasError;
	      }),
	          observables_with_initial_values = this.observables_list.filter(function (obs) {
	        return obs.initial_value || obs.initial_length;
	      });
	      this.errors = {};
	      errorable.forEach(function (obs) {
	        if (obs.postable_name) _this2.errors[obs.postable_name] = _com(function () {
	          return obs.hasError() ? obs.validationMessage() : null;
	        });else if (obs.errorable_observables) _this2.errors[obs.errorable_name] = _com(function () {
	          return obs.hasError() ? obs.errors() : null;
	        });
	      });
	      this.numErrors = this.numErrors || _com(function () {
	        return errorable.reduce(function (total, obs) {
	          return total + (obs.hasError() ? obs.numErrors ? obs.numErrors() : 1 : 0);
	        }, 0);
	      });
	
	      this.is_valid = _com(function () {
	        var is_valid = _this2.numErrors() === 0;
	        if (is_valid) {
	          if (_this2.validation_messenger) {
	            _this2.validation_messenger.cancel();
	            delete _this2.validation_messenger;
	          }
	        }
	        return is_valid;
	      }).extend({ notify: 'always' });
	
	      this.no_changes_pending = _com(function () {
	        var relationships_pendings = _this2.relationships.map(function (obs) {
	          var c = obs.no_changes_pending,
	              l = obs.initial_length;
	
	          return (c ? c() : true) && (l ? l() === obs().length : true);
	        }),
	            observable_value_pairs = observables_with_initial_values.map(function (obs) {
	          return obs.initial_value ? obs() === obs.initial_value() : obs().length === obs.initial_length();
	        });
	
	        return relationships_pendings.every(function (p) {
	          return p;
	        }) && observable_value_pairs.every(function (p) {
	          return p;
	        });
	      }).extend({ notify: 'always' });
	
	      this.changes_pending = _com(function () {
	        return !_this2.no_changes_pending();
	      }).extend({ notify: 'always' });
	
	      if (this.options.save_after_edit) {
	        (function () {
	          var reify_method = _this2.options.save_after_edit.reify_method;
	          var should_save = _com(function () {
	            var changes_pending = _this2.changes_pending();
	
	            var is_valid = _this2.is_valid();
	
	            return changes_pending && (_this2.id || is_valid);
	          }).extend({
	            rateLimit: {
	              method: 'notifyWhenChangesStop',
	              timeout: _this2.options.save_after_edit.rate_limit || 500
	            },
	            notify: 'always'
	          });
	
	          _this2.saving_locked = false;
	
	          should_save.subscribe(function (should) {
	            if (should && !_this2.saving_locked) {
	              _this2.save().then(function (record) {
	                return reify_method && _this2[reify_method](record);
	              })["catch"](function (err) {
	                if (typeof err === 'string') _this2.validation_messenger = errorNotice({ notice: err, id: 'validation' });else {
	                  _this2.saving_locked = true;
	                  _this2.error_message(err);
	                }
	              });
	            }
	          });
	        })();
	      }
	      delete this.init_finalizing;
	      this.init_finalized = true;
	    }
	  }]);
	
	  function KOFormBase() {
	    _classCallCheck(this, KOFormBase);
	
	    Object.assign(this, {
	      loading: _obs(true),
	      attempted: _obs(false),
	      error_message: _obs(null),
	      observables_list: [],
	      relationships: []
	    });
	  }
	
	  _createClass(KOFormBase, [{
	    key: "saveAndReload",
	    value: function saveAndReload() {
	      var _this3 = this;
	
	      var action = this.id ? 'update' : 'create';
	      this.save().then(function (record) {
	        successNotice({ notice: "Record " + action + "d" });
	        window.location = record && record.url ? record.url : _this3.url;
	      })["catch"](function (err) {
	        if (typeof err === 'string') _this3.validation_messenger = errorNotice({ notice: err, id: 'validation' });else if (err instanceof Error) {
	          console.log(err);
	          errorNotice({ notice: err.message });
	        }
	      });
	    }
	  }, {
	    key: "save",
	    value: function save() {
	      var _this4 = this;
	
	      return new Promise(function (resolve, reject) {
	        _this4.attempted(true);
	        var numErrors = _this4.numErrors();
	        if (numErrors) {
	          reject("There " + (numErrors === 1 ? "is 1 error which prevents" : "are " + numErrors + " errors which prevent") + " this form from being submitted.");
	          return;
	        }
	
	        ko_extras.json_api_utils.httpJSON[_this4.id ? 'patch' : 'post']({
	          url: _this4.url,
	          data: {
	            data: {
	              id: _this4.id,
	              type: _this4.type,
	              attributes: _this4.serialize()
	            }
	          }
	        }).then(function (response) {
	          var record = ko_extras.json_api_utils.parse_json_api_response(response);
	          if (record) {
	            _this4.id = record.id;
	            _this4.url = record.url;
	          }
	          resolve(record);
	        })["catch"](function (xhr) {
	          return reject(new ko_extras.json_api_utils.RequestError(xhr));
	        });
	      });
	    }
	  }, {
	    key: "serialize",
	    value: function serialize() {
	      var json = {};
	      this.observables_list.forEach(function (obs) {
	        var pname = obs.postable_name,
	            nname = obs.nestable_name,
	            val = obs();
	
	        if (pname) json[pname] = val instanceof Date ? val.toISOString() : val;else if (nname) json[nname] = obs.initial_length ? val.map(_serialize) : val.serialize();
	      });
	
	      this.relationships.forEach(function (obs) {
	        var nname = obs.nestable_name,
	            val = obs();
	        if (nname) json[nname] = obs.initial_length ? val.map(_serialize) : val.serialize();
	      });
	      return json;
	    }
	  }, {
	    key: "unsetObservables",
	    value: function unsetObservables() {
	      delete this.id;
	      this.url = this._url;
	      this.observables_list.forEach(function (obs) {
	        return obs('push' in obs ? [] : undefined);
	      });
	      this.attempted(false);
	    }
	  }, {
	    key: "doneLoading",
	    value: function doneLoading() {
	      var _this5 = this;
	
	      return this.loading() && new Promise(function (resolve, reject) {
	        var e = undefined,
	            l = undefined;
	        e = _this5.error_message.subscribe(function (err) {
	          l.dispose();
	          e.dispose();
	          reject(err);
	        });
	        l = _this5.loading.subscribe(function () {
	          l.dispose();
	          e.dispose();
	          if (_this5.error_message()) reject(_this5.error_message());else resolve();
	        });
	      }) || Promise.resolve();
	    }
	  }]);
	
	  return KOFormBase;
	})();
	
	exports["default"] = KOFormBase;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map