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
	
	var _jsonApiUtils = __webpack_require__(1);
	
	var json_api_utils = _interopRequireWildcard(_jsonApiUtils);
	
	var _koFormBase = __webpack_require__(2);
	
	var _koFormBase2 = _interopRequireDefault(_koFormBase);
	
	window.ko_extras = {};
	
	Object.assign(window.ko_extras, { json_api_utils: json_api_utils, KOFormBase: _koFormBase2['default'] });

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.create_observable = create_observable;
	exports.parse_json_api_response = parse_json_api_response;
	exports.create_relationship = create_relationship;
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
	
	function _remap_with_included_records(record) {
	  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var get_included_record = _ref2.get_included_record;
	  var immybox = _ref2.immybox;
	  var nested_immybox_relationships = _ref2.nested_immybox_relationships;
	
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
	
	function create_observable(vm, attr_name, attr_val) {
	  vm[attr_name] = _obs().extend({
	    postable: attr_name,
	    initial_value: attr_val
	  });
	  if (vm.observables_list) vm.observables_list.push(vm[attr_name]);
	  return vm[attr_name];
	}
	
	function parse_json_api_response(response) {
	  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (!response) return;
	
	  if (response.included) opts.get_included_record = _get_included(response.included);
	
	  if (response.data instanceof Array) return response.data.map(function (elem) {
	    return _remap_with_included_records(elem, opts);
	  });else return _remap_with_included_records(response.data, opts);
	}
	
	function create_relationship(vm, rel_name, rel_data, _ref3) {
	  var get_included_record = _ref3.get_included_record;
	  var client_defined_relationships = _ref3.client_defined_relationships;
	
	  if (rel_data instanceof Array) {
	    (function () {
	      var arr = vm[rel_name] || (vm[rel_name] = _arr([])),
	          records = rel_data;
	
	      if (get_included_record) records = records.map(function (rec) {
	        return _remap_with_included_records(rec, { get_included_record: get_included_record });
	      });
	
	      if (client_defined_relationships) {
	        var relationship = client_defined_relationships.find(function (r) {
	          return r.name === rel_name;
	        });
	        if (relationship) {
	          if (relationship.allow_destroy) vm['non_deleted_' + rel_name] = _com(function () {
	            return arr().filter(function (obj) {
	              return !obj.marked_for_deletion();
	            });
	          });
	
	          if (relationship.nested_attributes_accepted) arr.extend({
	            nestable: rel_name,
	            initial_length: records.length,
	            watch_for_pending_changes: true
	          });
	
	          if (relationship['class']) {
	            (function () {
	              var klass = relationship['class'];
	              records = records.map(function (r) {
	                return new klass(vm, r);
	              });
	
	              if (relationship.blank_value) arr.extend({
	                pushable: [relationship['class'], vm, relationship.blank_value]
	              });
	            })();
	          }
	        }
	      }
	      arr(records);
	    })();
	  } else if (rel_data) {
	    var obs = vm[rel_name] || (vm[rel_name] = _obs()),
	        remapped = _remap_with_included_records(rel_data, { get_included_record: get_included_record }),
	        record = undefined;
	
	    if (client_defined_relationships) {
	      var relationship = client_defined_relationships.find(function (r) {
	        return r.name === rel_name;
	      });
	      if (relationship) {
	        if (relationship.nested_attributes_accepted) obs.extend({
	          nestable: rel_name,
	          watch_for_pending_changes: true
	        });
	        if (relationship['class']) {
	          var klass = relationship['class'];
	          record = new klass(vm, Object.assign({}, remapped));
	        }
	      }
	    }
	    obs(record || remapped);
	  } else {
	    var obs = vm[rel_name] || (vm[rel_name] = _obs()),
	        record = undefined;
	
	    if (client_defined_relationships) {
	      var relationship = client_defined_relationships.find(function (r) {
	        return r.name === rel_name;
	      });
	
	      if (relationship) {
	        if (relationship.nested_attributes_accepted) obs.extend({
	          nestable: rel_name,
	          watch_for_pending_changes: true
	        });
	        if (relationship['class']) {
	          var klass = relationship['class'],
	              blank_value = relationship.blank_value || {};
	
	          record = new klass(vm, Object.assign({}, typeof blank_value === 'function' ? blank_value.call(vm) : blank_value));
	        }
	      }
	    }
	    obs(record || {});
	  }
	
	  return vm[rel_name];
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
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
	
	var _encode_uri = function _encode_uri(url, obj) {
	  if (Object.keys(obj).length === 0) return url;
	  var str = "";
	  for (var key in obj) {
	    if (str !== "") str += "&";
	    str += key + "=" + encodeURIComponent(obj[key]);
	  }
	  return url + "?" + str;
	};
	
	var _base_request = function _base_request(resolve, reject) {
	  var request = new XMLHttpRequest();
	  request.onreadystatechange = function () {
	    if (this.readyState === 4) // done
	      if (this.status === 200) resolve(JSON.parse(this.response || "null"));else reject(this);
	  };
	  request.onerror = function () {
	    reject(this);
	  };
	  return request;
	};
	
	var httpJSON = {
	  get: function get(req) {
	    if (req instanceof Array) return Promise.all(req.map(function (elem) {
	      return httpJSON.get(elem);
	    }));
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
	  }
	};
	
	var RequestError = (function (_Error) {
	  _inherits(RequestError, _Error);
	
	  function RequestError(xhr) {
	    _classCallCheck(this, RequestError);
	
	    var message = undefined,
	        errors_from_server = undefined,
	        name = "RequestError",
	        json = JSON.parse(xhr.responseText || "null");
	
	    if (json && json.errors) {
	      errors_from_server = json.errors;
	      if (json.errors.length === 1) message = json.errors[0].title;
	    }
	    if (!message) message = xhr.statusText || "An error occurred while sending the request";
	    _get(Object.getPrototypeOf(RequestError.prototype), "constructor", this).call(this, message);
	    this.message = message;
	    this.name = name;
	    this.status = xhr.status;
	    if (errors_from_server) this.errors_from_server = errors_from_server;
	  }
	
	  return RequestError;
	})(Error);
	
	var KOFormBase = (function () {
	  _createClass(KOFormBase, [{
	    key: "beginInit",
	    value: function beginInit(opts) {
	      var _this = this;
	
	      return new Promise(function (resolve, reject) {
	        if (!_this.init_begun && !_this.init_finalized) {
	          _this.options = opts;
	          var url = opts.url;
	          var request_opts = opts.request_opts;
	          var other_requests = opts.other_requests;
	
	          if (!url) throw new Error("Please provide a URL");
	          var requests = [{ url: url, data: Object.assign({}, request_opts) }].concat(_toConsumableArray((other_requests || []).map(function (req) {
	            return typeof req === 'string' ? { url: req, data: {} } : {
	              url: req.url,
	              data: Object.assign({}, req.request_opts)
	            };
	          })));
	          httpJSON.get(requests).then(function (_ref2) {
	            var _ref22 = _toArray(_ref2);
	
	            var main_response = _ref22[0];
	
	            var other_responses = _ref22.slice(1);
	
	            return _this.init(main_response).then(function () {
	              return Promise.all([_this.handleOtherRequests(other_responses), Promise.resolve()]);
	            });
	          }).then(resolve)["catch"](reject);
	        } else throw new Error("Cannot begin init more than once");
	      });
	    }
	  }, {
	    key: "init",
	    value: function init(response) {
	      var record = response.data,
	          client_defined_relationships = this.options.relationships,
	          server_defined_relationships = record.relationships || {},
	          server_defined_attributes = record.attributes || {},
	          get_included_record = response.included ? _get_included(response.included) : undefined;
	
	      this.id = record.id;
	      if (this.id) this.id = Number.parseInt(this.id, 10);
	      this.type = record.type;
	
	      this.url = server_defined_attributes.url;
	      delete server_defined_attributes.url;
	
	      for (var key in server_defined_attributes) {
	        ko_extras.json_api_utils.create_observable(this, key, server_defined_attributes[key]);
	      }for (var key in server_defined_relationships) {
	        var data = server_defined_relationships[key].data;
	
	        this.relationships.push(ko_extras.json_api_utils.create_relationship(this, key, data, {
	          get_included_record: get_included_record,
	          client_defined_relationships: client_defined_relationships
	        }));
	      }
	
	      return Promise.resolve();
	    }
	  }, {
	    key: "finalizeInit",
	    value: function finalizeInit() {
	      var _this2 = this;
	
	      return new Promise(function (resolve) {
	        if (!_this2.init_finalized) {
	          (function () {
	            var errorable = _this2.observables_list.filter(function (obs) {
	              return obs.hasError;
	            }),
	                observables_with_initial_values = _this2.observables_list.filter(function (obs) {
	              return obs.initial_value || obs.initial_length;
	            });
	            _this2.errors = {};
	            errorable.forEach(function (obs) {
	              if (obs.postable_name) _this2.errors[obs.postable_name] = _com(function () {
	                return obs.hasError() ? obs.validationMessage() : null;
	              });else if (obs.errorable_observables) _this2.errors[obs.errorable_name] = _com(function () {
	                return obs.hasError() ? obs.errors() : null;
	              });
	            });
	            _this2.numErrors = _this2.numErrors || _com(function () {
	              return errorable.reduce(function (total, obs) {
	                return total + (obs.hasError() ? obs.numErrors ? obs.numErrors() : 1 : 0);
	              }, 0);
	            });
	
	            _this2.is_valid = _com(function () {
	              var is_valid = _this2.numErrors() === 0;
	              if (is_valid) {
	                if (_this2.validation_messenger) {
	                  _this2.validation_messenger.cancel();
	                  delete _this2.validation_messenger;
	                }
	              }
	              return is_valid;
	            }).extend({ notify: 'always' });
	
	            _this2.no_changes_pending = _com(function () {
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
	
	            _this2.changes_pending = _com(function () {
	              return !_this2.no_changes_pending();
	            }).extend({ notify: 'always' });
	
	            if (_this2.options.save_after_edit) {
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
	                      if (reify_method) _this2[reify_method](record);
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
	            _this2.init_finalized = true;
	          })();
	        } else throw new Error("Cannot finalize init more than once");
	        resolve();
	      });
	    }
	  }, {
	    key: "handleOtherRequests",
	    value: function handleOtherRequests(responses) {
	      // Overload this method to handle responses
	      return Promise.resolve();
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
	
	      this.attempted(true);
	      if (this.numErrors() !== 0) return Promise.reject("There " + (this.numErrors() === 1 ? "is 1 error which prevents" : "are " + this.numErrors() + " errors which prevent") + " this form from being submitted.");
	      var data = {
	        id: this.id,
	        type: this.type,
	        attributes: this.serialize()
	      };
	      return httpJSON[this.id ? 'patch' : 'post']({ url: this.url, data: { data: data } }).then(function (response) {
	        var record = ko_extras.json_api_utils.parse_json_api_response(response);
	        if (record) {
	          _this4.id = record.id;
	          _this4.url = record.url;
	        }
	        return Promise.resolve(record);
	      })["catch"](function (xhr) {
	        return Promise.reject(new RequestError(xhr));
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
	      this.observables_list.forEach(function (obs) {
	        return obs('push' in obs ? [] : undefined);
	      });
	      this.attempted(false);
	    }
	  }, {
	    key: "doneLoading",
	    value: function doneLoading() {
	      var _this5 = this;
	
	      if (this.loading()) return new Promise(function (resolve) {
	        var s = _this5.loading.subscribe(function () {
	          s.dispose();
	          resolve();
	        });
	      });else return Promise.resolve();
	    }
	  }]);
	
	  return KOFormBase;
	})();
	
	exports["default"] = KOFormBase;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map