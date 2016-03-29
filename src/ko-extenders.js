import {observable, observableArray, computed, pureComputed, unwrap} from 'knockout';
import Fraction from 'fraction.js';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';

const extenders = {};

function dispose(obj) {
  obj.dispose();
}

/**
 * Attaches disposables array to `target`.
 *
 * disposables holds a list of computeds/subscribers that should be disposed
 * when `target` is disposed
 * @name setupObservableDisposables
 * @param {ko.observable} target
 * @private
*/

function setupObservableDisposables(target) {
  if (target.disposables) return;
  target.disposables = [];
  target.dispose_sub_observables = () => setTimeout(() => {
    target.disposables.forEach(dispose);
  });
}

/**
 * Creates a Knockout.js extender
 * @name setupExtender
 * @param {string} extender_name - The name of the extender
 * @param {Function} extender_fn - The extender function
 * @param {Object} [opts]
 * @param {Array.<string>} [opts.incompatible_extenders] - Array of extender
 * names that should not be applied along with `extender_name`
 * @throws {Error} Throws an error if any extenders have been applied that are
 * in `incompatible_extenders`
 * @private
 * @return {ko.observable} The result of calling `extender_fn` with arguments
 * passed to the extender
*/

function setupExtender(extender_name, extender_fn, opts) {
  function extender(target, ...args) {
    const applied_extenders = target.applied_extenders || [];
    if (opts && opts.incompatible_extenders && applied_extenders.length) {
      opts.incompatible_extenders.forEach(incompatible_extender => {
        if (~applied_extenders.indexOf(incompatible_extender)) {
          throw new Error(`KO Extender ${extender_name} is not compatible with ${incompatible_extender}`);
        }
      });
    }
    applied_extenders.push(extender_name);
    target.applied_extenders = applied_extenders;
    return extender_fn(target, ...args);
  }

  // set the name of the extender function to extender_name (for readability
  // in stack traces and such)
  Object.defineProperty(extender, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: extender_name
  });

  extenders[extender_name] = extender;
}

/**
 * Wraps `target` in a `ko.pureComputed` that sanitizes values written to
 * `target` with the given `sanitize_fn` function
 * @name computedSanitizeProxy
 * @param {ko.observable} target
 * @param {Function} sanitize_fn
 * @private
 * @return {ko.pureComputed} The proxying function
*/

function computedSanitizeProxy(target, sanitize_fn) {
  const result = pureComputed({
    read: target,
    write(new_val) {
      if (new_val) {
        const current = target();
        const val_to_write = sanitize_fn(new_val);

        if (val_to_write !== current) {
          // if the sanitized value is different from the current value,
          // pass the value into target
          target(val_to_write);
        } else if (new_val !== current) {
          // if the sanitized value is the same as the current value, but is
          // different from what the user gave us, force target to reset to the
          // sanitized val
          target.notifySubscribers(val_to_write);
        }
      } else {
        target(new_val);
      }
    }
  }).extend({notify: 'always'});

  // Idempotently create a disposables array on target
  setupObservableDisposables(target);

  // The extender will be returning result instead of target, so we need to make
  // result have a similar interface as target by copying over target's
  // properties that are relevant to extension
  Object.assign(result, {
    hasError: target.hasError,
    has_focus: target.has_focus,
    has_had_focus: target.has_had_focus,
    validationMessage: target.validationMessage,
    initial_value: target.initial_value,
    disposables: target.disposables,
    dispose_sub_observables: target.dispose_sub_observables,
    sanitize: sanitize_fn
  });

  // Run target through the proxy, to sanitize the initial value and whatnot
  result(target());

  // since result is itself a computed, push it onto the array of things to be
  // disposed of when target is disposed
  result.disposables.push(result);

  result.initial_value && result.initial_value(result());
  return result;
}

/**
 * @name typeObservableFunction
 * @param {string} type
 * @private
 * @return {Object} Object with keys `type` (string) and `observable`
 * (ko.observable)
*/

function typeObservableFunction(type) {
  return {type, observable: observable()};
}

/**
 * Attaches validation-related observables to the suppplied observable:
 *
 * `.errors` (ko.observableArray) - the array of errors tracked with this
 * observable
 *
 * `.hasError` (ko.computed) - true if any of the observables errors are true
 *
 * `.validationMessage` (ko.computed) - The message from the first true error of
 * `.errors` array
 * @name setupValidationObservables
 * @param {ko.observable} target
 * @private
 * @return {Function} Returning Object with keys `type` (string) and
 * `observable` (ko.observable)
*/

function setupValidationObservables(target) {
  if (target.validationMessage) return typeObservableFunction;
  setupObservableDisposables(target);
  target.errors = observableArray([]);

  // hasError: true if one of the validations on this observable fails
  target.hasError = computed(() => target.errors().some(({observable: o}) => o()));
  target.disposables.push(target.hasError);

  // validationMessage: the message from the first failing validation
  target.validationMessage = computed(() => {
    const first_invalid = target.errors().find(({observable: o}) => o());
    return first_invalid && first_invalid.observable();
  });
  target.disposables.push(target.validationMessage);

  return typeObservableFunction;
}

/**
 * Adds `initial_value` observable to `target`
 *
 * When `target.initial_value` is called with a parameter, it and `target` are
 * both updated
 *
 * If `target` has a `sanitize` function, any parameter that passes through
 * `target.initial_value` is first passed through `sanitize`
 * @name ko.extenders.initial_value
 * @param {ko.observable} target
 * @param {anything} initial_value - The value to initialize `target` to
 * @return {ko.observable} The extended `target`
*/

setupExtender('initial_value', (target, init_val) => {
  setupObservableDisposables(target);

  // so we can track when the sanitizer is being called repeatedly
  let [sanitize_count, first_pass_unsanitized_value] = [0, null];

  const initial_value_observable = observable().extend({notify: 'always'});

  function sanitizeAndInitializeTarget(new_val) {
    // pass val through target's sanitizer, if it exists.
    const val = target.sanitize ? target.sanitize(new_val) : new_val;
    if (val !== target()) {
      // target's current value is not sanitized. First, check to make sure we
      // didn't already try to sanitize this value.

      if (sanitize_count) {
        // if sanitize_count is greater than 0, it means we just tried to
        // initialize, the initializer needed to sanitize, initializer was
        // called again, and it needed sanitizing again. This means the
        // sanitizer did not sanitize an already-sanitized value to the same
        // value, which would result in an infinite loop. Throw an error!

        throw Object.assign(new Error('Target\'s sanitize function is not idempotent.'), {
          target,
          first_pass_unsanitized_value,
          second_pass_unsanitized_value: val
        });
      }

      sanitize_count += 1;
      // set target to the sanitized value and re-initialize
      target(val);
      first_pass_unsanitized_value = new_val;
      sanitizeAndInitializeTarget(val);
    } else {
      // target's value is sanitized
      // unset our counter and first unsanitized value, if they're set
      [sanitize_count, first_pass_unsanitized_value] = [0, null];

      // Update target.initial_value if it's not already. Doing so will trigger
      // sanitizeAndInitializeTarget to run again, but when it does, this check
      // will not pass, and the chain of events will stop
      val !== target.initial_value() && target.initial_value(val);
    }
  }
  if (target.initial_value) {
    const index = target.disposables.indexOf(target.initial_value);
    if (~index) {
      const [old_computed] = target.disposables.splice(index, 1);
      old_computed && old_computed.dispose();
    }
  }

  target.initial_value = computed({
    read: initial_value_observable,
    write(new_val) {
      initial_value_observable(new_val);
      sanitizeAndInitializeTarget(new_val);
    }
  });
  target.disposables.push(target.initial_value);
  target.initial_value(init_val);
  return target;
});

/**
 * Adds `postable_name` to `target`
 * @name ko.extenders.postable
 * @param {ko.observables} target
 * @param {string} postable_name
 * @return {ko.observable} The extended target
*/

setupExtender('postable', (target, postable_name) => {
  target.postable_name = postable_name;
  return target;
});

/**
 * Adds initial_length observable to `target`, initialized to `initial_length`
 * @name ko.extenders.initial_length
 * @param {ko.observable} target
 * @param {number} initial_length - The value to initialize
 * `target.initial_length` with
 * @return {ko.observable} The extended target
*/

setupExtender('initial_length', (target, initial_length) => {
  target.initial_length = observable(initial_length);
  return target;
});

/**
 * Subscribes fn to target
 * @name ko.extenders.after_change
 * @param {ko.observable} target
 * @param {Function} fn
 * @return {ko.observable} The extended target
*/

setupExtender('after_change', (target, fn) => {
  setupObservableDisposables(target);
  target.disposables.push(target.subscribe(fn));
  return target;
});


/**
 * Subscribes fn to target, to be called before target changes
 * @name ko.extenders.before_change
 * @param {ko.observable} target
 * @param {Function} fn
 * @return {ko.observable} The extended target
*/

setupExtender('before_change', (target, fn) => {
  setupObservableDisposables(target);
  target.disposables.push(target.subscribe(fn, null, 'beforeChange'));
  return target;
});

function fakeEnable(){
  return true;
}

/**
 * Adds a validation observable which returns `false` if `target()` is empty,
 * `null` otherwise
 * @name ko.extenders.required
 * @param {ko.observable} target
 * @param {(Object|string)} [opts] - Options or validation message
 * @param {string} [opts.message="This field is required"] - The validation
 * message
 * @param {(Function|ko.computed)} [opts.enable_when] - Bool-returning function
 * to dictate when validation should be enabled
 * @return {ko.observable} The extended target
*/

setupExtender('required', (target, opts) => {
  const validation_obj = setupValidationObservables(target)('required');
  let message, enabled;

  if (typeof opts === 'string' || !opts) {
    message = opts;
    enabled = fakeEnable;
  } else {
    message = opts.message;
    enabled = opts.enable_when || fakeEnable;
    enabled.dispose && target.disposables.push(enabled);
  }

  target.errors.push(validation_obj);

  function validate(new_val) {
    if (new_val || new_val === 0 || !enabled()) {
      validation_obj.observable(null);
    } else {
      validation_obj.observable(message || 'This field is required');
    }
  }

  validate(target());

  target.disposables.push(target.subscribe(validate));

  enabled.subscribe && target.disposables.push(enabled.subscribe(() => validate(target())));

  return target;
});

/**
 * Adds a validation observable which returns `false` if `target()` is not an
 * email, `null` otherwise
 * @name ko.extenders.email
 * @param {ko.observable} target
 * @param {string} [message="Invalid email address. Must be of the form
 * 'john@website.com'"] - The validation message
 * @return {ko.observable} The extended target
*/

setupExtender('email', (target, message) => {
  const validation_obj = setupValidationObservables(target)('email');
  target.errors.push(validation_obj);

  const re = new RegExp(/^\S+@\S+\.\S+$/);

  function validate(new_val) {
    if (new_val || new_val === 0) {
      if (re.test(new_val)) {
        validation_obj.observable(null);
      } else {
        validation_obj.observable(message || 'Invalid email address. Must be of the form \'john@website.com\'');
      }
    } else {
      validation_obj.observable(null);
    }
  }

  validate(target());

  target.disposables.push(target.subscribe(validate));

  return target;
});

/**
 * Adds a validation observable which returns `false` if `target()` is not a
 * phone number, `null` otherwise
 *
 * Reformats correct phone numbers as "(nnn) nnn-nnnn"
 * @name ko.extenders.phone
 * @param {ko.observable} target
 * @param {string} [message="Invalid phone number. Must be 10 digits"] - The
 * validation message
 * @return {ko.observable} The extended target
*/

setupExtender('phone', (target, message) => {
  const validation_obj = setupValidationObservables(target)('phone');
  target.errors.push(validation_obj);
  const re = new RegExp(/^((\d)?(\d{3}))?(\d{3})(\d{4})$/);

  function validate(new_val) {
    if (new_val && typeof new_val === 'string') {
      const matches = new_val.replace(/[+()\s.-]*/g, '').match(re);
      if (matches) {
        if (matches[2]) {
          validation_obj.observable(message || 'Invalid phone number. Must be 10 digits');
        } else if (matches[3]) {
          target(`(${matches[3]}) ${matches[4]}-${matches[5]}`);
          validation_obj.observable(null);
        } else {
          validation_obj.observable(message || 'Invalid phone number. Must be 10 digits');
        }
      } else {
        validation_obj.observable(message || 'Invalid phone number. Must be 10 digits');
      }
    } else {
      validation_obj.observable(null);
    }
  }

  validate(target());

  target.disposables.push(target.subscribe(validate));

  return target;
});

/**
 * Adds a validation observable which returns `false` if `target()` is not
 * unique in `uniq_in` mapped to `options.attribute_name`, `null` otherwise
 * @name ko.extenders.unique
 * @param {ko.observable} target
 * @param {Object} opts
 * @param {(Array|ko.observableArray)} opts.uniq_in - The array to assert
 * uniqueness in
 * @param {string} opts.attribute_name - The key whose matching value (in the
 * elements of `uniq_in`) must not equal `target()`
 * @param {string} [opts.message="Must be unique"] - The validation message
 * @return {ko.observable} The extended target
 * @throws {Error} Throws an error if called without `opts` parameter
*/

setupExtender('unique', (target, opts) => {
  if (!opts) {
    throw new Error('Cannot determine uniqueness of target without opts.uniq_in and opts.attribute_name');
  }
  const {uniq_in, attribute_name, message} = opts || {};
  const validation_obj = setupValidationObservables(target)('unique');
  target.errors.push(validation_obj);

  function validate(mapped_array) {
    const val = target();
    if (val || val === 0) {
      const duplicated = mapped_array.filter(attr => attr === val).length > 1;
      if (duplicated) {
        validation_obj.observable(message || 'Must be unique');
      } else {
        validation_obj.observable(null);
      }
    } else {
      validation_obj.observable(null);
    }
  }

  const mapped_array = computed(() => unwrap(uniq_in).map(obj => unwrap(obj[attribute_name])));

  const computed_subscriber = mapped_array.subscribe(validate);

  target.disposables.push(mapped_array, computed_subscriber);

  return target;
});

/**
 * @name ko.extenders.numeric
 * @param {ko.observable} target
 * @param {Object} [opts]
 * @param {number} [opts.precision] - The number of decimals to allow when
 * enforcing numericality
 * @param {boolean} [opts.allow_imprecision=true] - Whether or not to allow
 * the number of decimals to be less than `opts.precision`
 * @param {string} [opts.sign] - The sign of the number to allow when enforcing
 * numericality
 * @param {(number|string)} [opts.default] - The default value to use if
 * `target` is updated with `null`, `undefined` or `""`
 * @param {boolean} [opts.allow_rational=false] - Whether or not to allow the
 * number to be a fraction
 * @return {ko.pureComputed} Computed wrapper around target
*/

setupExtender('numeric', function numeric(target, opts) {
  const {precision, sign, default: default_val, allow_rational} = opts || {};
  const multiplier = precision && Math.pow(10, precision) || null;
  const disallow_imprecision = multiplier && (opts.allow_imprecision === false) || false;

  function stripDisallowedCharacters(value) {
    if (allow_rational) {
      return value && String(value).replace(/[^\d\.\/]/g, '') || null;
    }
    return value && String(value).replace(/[^\d\.]/g, '') || null;
  }

  function sanitize(value) {
    let out = stripDisallowedCharacters(value);

    if (out === null && (default_val || default_val === 0)) {
      out = String(default_val);
    }

    if (out) {
      const is_rational = Boolean(~out.indexOf('/'));
      try {
        is_rational && (out = new Fraction(out));
      } catch (e) {
        if (e === 'Invalid Param') {
          return sanitize(null);
        }
        throw e;
      }
      !is_rational && multiplier && (out = Math.round(Number.parseFloat(+out) * multiplier) / multiplier);
      !is_rational && precision === 0 && (out = Number.parseInt(out, 10));
      sign === 'positive' && (out = !is_rational && Math.abs(out) || out.abs());
      sign === 'negative' && (out = !is_rational && -Math.abs(out) || out.abs().mul(-1));
      is_rational && (out = out.toFraction());
      !is_rational && disallow_imprecision && (out = out.toFixed(precision));
    }
    return out;
  }

  // Attach the sanitizer to target so that any extenders that have been applied
  // before this extender can have access to it.
  //
  // TODO we should make sure this sanitizer doesn't interfere with other
  // sanitizers that may have been created for other extenders. Perhaps
  // something like a sanitizers array and a sanitize function that just applies
  // the sanitizers one-by-one
  Object.assign(target, {sanitize});

  return computedSanitizeProxy(target, sanitize);
}, {
  incompatible_extenders: ['duration', 'time']
});

const days_in_year = 365;
const days_in_month = 30;
const days_in_week = 7;

const millis_in_second = 1000;
const millis_in_minute = 60 * millis_in_second;
const millis_in_hour = 60 * millis_in_minute;
const millis_in_day = 24 * millis_in_hour;
const millis_in_week = days_in_week * millis_in_day;
const millis_in_month = days_in_month * millis_in_day;
const millis_in_year = days_in_year * millis_in_day;

/**
 * Returns the number of milliseconds represented by the human-readable date `str`
 *
 * E.g. `str === "1 year 2 months 3 weeks 4 days 5 hours 6 minutes 7 seconds"`
 * @param {string} str - The string to parse into milliseconds
 * @private
 * @return {number} The milliseconds parsed from str
*/

function getMillisecondsFromString(str) {
  let millis = 0;
  if (str.match(/[^\d\.]/)) { // string contains non-number characters
    let tmp;
    const years = (tmp = str.match(/((\d*\.)?\d+)\s*y/i)) && tmp[1] || 0;
    const months = (tmp = str.match(/((\d*\.)?\d+)\s*mo/i)) && tmp[1] || 0;
    const weeks = (tmp = str.match(/((\d*\.)?\d+)\s*w/i)) && tmp[1] || 0;
    const days = (tmp = str.match(/((\d*\.)?\d+)\s*d/i)) && tmp[1] || 0;
    const hours = (tmp = str.match(/((\d*\.)?\d+)\s*h/i)) && tmp[1] || 0;
    const minutes = (tmp = str.match(/((\d*\.)?\d+)\s*(m\s|m$|mi)/i)) && tmp[1] || 0;
    const seconds = (tmp = str.match(/((\d*\.)?\d+)\s*s/i)) && tmp[1] || 0;

    millis += Number.parseInt(seconds, 0) * millis_in_second;
    millis += Number.parseInt(minutes, 0) * millis_in_minute;
    millis += Number.parseInt(hours, 0) * millis_in_hour;
    millis += Number.parseInt(days, 0) * millis_in_day;
    millis += Number.parseInt(weeks, 0) * millis_in_week;
    millis += Number.parseInt(months, 0) * millis_in_month;
    millis += Number.parseInt(years, 0) * millis_in_year;

  } else { // str contains no non-number characters
    const num_days = Number.parseInt(str, 10);
    num_days && (millis = millis_in_day * num_days);
  }

  return millis;
}

/**
 * Returns a human-readable string from the given milliseconds
 * @name humanizeMilliseconds
 * @param {number} millis
 * @param {Object} [opts]
 * @param {Array.<string>} [opts.units=['y', 'mo', 'w', 'd', 'h', 'm', 's']] -
 * The duration units to use when converting the string
 * @param {string} [opts.delimiter=" "] - The delimiter to insert between two
 * duration units
 * @param {Boolean} [opts.round=false] - Whether or not to round
 * @private
 * @return {string} The milliseconds represented as a string
*/

function humanizeMilliseconds(millis, opts) {
  const {units, delimiter, round} = opts || {};
  return humanizeDuration(millis, {
    delimiter: delimiter || ' ',
    units: units || ['y', 'mo', 'w', 'd', 'h', 'm', 's'],
    round: !!round,
    unitMeasures: {
      y: millis_in_year,
      mo: millis_in_month,
      w: millis_in_week,
      d: millis_in_day,
      h: millis_in_hour,
      m: millis_in_minute,
      s: millis_in_second
    }
  });
}

/**
 * Returns a human-readable string from the given human-readable string
 *
 * If the provided string is not parseable, returns an empty string
 *
 * All options are passed to `humanizeDuration`
 * @name sanitizeDuration
 * @param {string} val - The string to sanitize
 * @param {Object} [opts] - Options passed to humanizeDuration
 * @private
 * @return {string} The sanitized human-readable duration string
*/

function sanitizeDuration(val, opts) {
  const out = humanizeMilliseconds(getMillisecondsFromString(val), opts || {});
  return out[0] === '0' ? '' : out;
}

/**
 * Enforces/coerces `target`'s value into a human-readable duration
 * @name ko.extenders.duration
 * @param {ko.observable} target
 * @param {Object} [opts]
 * @param {Array.<string>} [opts.units=['y', 'mo', 'w', 'd', 'h', 'm', 's']] -
 * The duration units to use when converting the string
 * @param {string} [opts.delimiter=" "] - The delimiter to insert between two
 * duration units
 * @param {Boolean} [opts.round=false] - Whether or not to round
 * @return {ko.pureComputed} Computed wrapper around target
*/

setupExtender('duration', function duration(target, opts) {
  const {units, delimiter, round} = opts || {};
  let sanitized_units;
  if (units) {
    sanitized_units = units.map(u => {
      switch (u.slice(0, 2)) {
      case 'y':
      case 'ye':
        return 'y';
      case 'mo':
        return 'mo';
      case 'w':
      case 'we':
        return 'w';
      case 'd':
      case 'da':
        return 'd';
      case 'h':
      case 'ho':
        return 'h';
      case 'm':
      case 'mi':
        return 'm';
      case 's':
      case 'se':
        return 's';
      default:
        return null;
      }
    })
    .filter(u => u);

    !sanitized_units.length && (sanitized_units = null);
  }

  function sanitize(val) {
    const opts = {};
    sanitized_units && (opts.units = sanitized_units);
    delimiter || delimiter === '' && (opts.delimiter = delimiter);
    round && (opts.round = round);
    return sanitizeDuration(val, opts);
  }

  // Attach the sanitizer to target so that any extenders that have been applied
  // before this extender can have access to it.
  //
  // TODO we should make sure this sanitizer doesn't interfere with other
  // sanitizers that may have been created for other extenders. Perhaps
  // something like a sanitizers array and a sanitize function that just applies
  // the sanitizers one-by-one
  Object.assign(target, {sanitize});

  return computedSanitizeProxy(target, sanitize);
}, {
  incompatible_extenders: ['numeric', 'time']
});

/**
 * Enfoce/coerce the `target` into a time
 * @name ko.extenders.time
 * @param {ko.observable} target
 * @param {Object} [opts]
 * @param {string} [opts.format="HH:mm A"] - The format to enforce the time with
 * @return {ko.pureComputed} Computed wrapper around target
*/

setupExtender('time', function time(target, opts) {
  const {format} = opts || {format: 'HH:mm A'};
  function sanitize(val) {
    return moment(val, format).format(format);
  }

  // Attach the sanitizer to target so that any extenders that have been applied
  // before this extender can have access to it.
  //
  // TODO we should make sure this sanitizer doesn't interfere with other
  // sanitizers that may have been created for other extenders. Perhaps
  // something like a sanitizers array and a sanitize function that just applies
  // the sanitizers one-by-one
  Object.assign(target, {sanitize});

  return computedSanitizeProxy(target, sanitize);
}, {
  incompatible_extenders: ['numeric', 'duration']
});

/**
 * Attaches `no_pending_changes` ko.computed to `target`.
 *
 * `target.no_pending_changes` returns true if:
 *
 * `target` is a ko.observableArray and all elements (e) of `target()` satisfy
 * `e.no_pending_changes() === true`
 *
 * or
 *
 * `target` is not a ko.observableArray and target().no_pending_changes === true
 * @name ko.extenders.no_pending_changes
 * @param {ko.observable|ko.observableArray} target
 * @return {ko.observable|ko.observableArray} The extended target
*/

setupExtender('watch_for_pending_changes', (target) => {
  setupObservableDisposables(target);
  if ('push' in target) {
    target.no_changes_pending = computed(() => {
      return target().every(r => r.loading && r.loading() || r.no_changes_pending());
    }).extend({notify: 'always'});
  } else {
    target.no_changes_pending = computed(() => {
      const obj = target();
      if (obj && !obj.loading()) {
        return obj.no_changes_pending();
      }
      return true;
    }).extend({notify: 'always'});
  }

  target.disposables.push(target.no_changes_pending);
  return target;
});

/**
 * Adds `noUnset` key to `target`, initialized to `val`
 * @name ko.extenders.noUnset
 * @param {ko.observable} target
 * @param {string} val
 * @return {ko.observable} The extended target
*/

setupExtender('noUnset', (target, val) => {
  target.noUnset = val;
  return target;
});

/**
 * Adds an `addNew` method to `target`. `addNew` returns a promise, which
 * resolves with the new record instances after the instance has been added to
 * `target`.
 * @name ko.extenders.pushable
 * @param {ko.observable} target
 * @param {Object} opts
 * @param {Function} opts.klass - The class to instanciate when `addNew` is
 * called.
 * @param {Object} opts.this_arg - The object to bind functions which appear in
 * `opts.args` to. `this_arg` will also be used as the first parameter when
 * instanciating a new `opts.klass`.
 * @param {Array} [opts.args] - The arguments to pass to `klass` when
 * instanciating. Any elements of `opts.args` passing `typeof arg === function`
 * will be called with `this_arg` as the scope
 * @param {Boolean|String} [opts.set_inverse_of] - Whether or not to add a
 * reference to `target` on instances of `opts.klass`. If `true`, the reference
 * will be set on the key "inverse_of"; if String, the reference will be set on
 * the key String
 * @return {ko.observable} The extended target
*/

function _createInstance(klass, this_arg, args) {
  return new klass(
    this_arg,
    ...(args.map(arg => typeof arg === 'function' ? arg.call(this_arg) : arg))
  );
}

function _pushAndResolve(target, record, resolver) {
  if ('doneLoading' in record) {
    record.doneLoading().then(() => {
      target.push(record);
      resolver(record);
    });
  } else {
    target.push(record);
    resolver(record);
  }
}

setupExtender('pushable', (target, opts) => {
  if ('push' in target) {
    const {klass, this_arg, set_inverse_of} = opts || {};
    const args = opts.args || [];
    if (!klass) {
      throw new Error('Cannot define addNew method without knowing the class to instanciate');
    }
    if (!this_arg) {
      throw new Error('Cannot define addNew method without knowing first parameter to instanciate klass with');
    }
    if (set_inverse_of) {
      const inverse_name = (typeof set_inverse_of === 'string') ? set_inverse_of : 'inverse_of';
      target.addNew = function addNew() {
        return new Promise(resolve => {
          const record = _createInstance(klass, this_arg, args);
          record[inverse_name] = target;
          _pushAndResolve(target, record, resolve);
        });
      };
    } else {
      target.addNew = function addNew() {
        return new Promise(resolve => _pushAndResolve(
          target,
          _createInstance(klass, this_arg, args),
          resolve)
        );
      };
    }
  }
  return target;
});

/**
 * Adds `nestable_name` and `resource_name` keys to `target`
 * @name ko.extenders.nestable
 * @param {ko.observable} target
 * @param {string} resource_name
 * @return {ko.observable} The extended target
*/

setupExtender('nestable', (target, resource_name) => {
  target.resource_name = resource_name;
  target.nestable_name = `${resource_name}_attributes`;
  return target;
});

/**
 * Adds `target.has_focus` observable to be used for focus-tracking
 *
 * `target.has_focus` should be bound with the `hasFocus` binding to a focusable
 * DOM element
 * @name ko.extenders.track_focus
 * @param {ko.observable} target
 * @param {Object} [opts]
 * @param {boolean} [opts.track_has_had] - Whether or not to create an
 * observable `target.has_had_focus` that tracks whether `target.has_focus` was
 * ever true
 * @return {ko.observable} The extended target
*/

setupExtender('track_focus', (target, opts) => {
  const {track_has_had} = opts || {};
  target.has_focus = observable(false);
  if (track_has_had) {
    setupObservableDisposables(target);
    target.has_had_focus = observable(false);
    const s = target.has_focus.subscribe(has_focus => {
      if (!has_focus) { // just blurred out of input
        target.has_had_focus(true);
        s.dispose();
      }
    });
    target.disposables.push(s);
  }
  return target;
});

export default extenders;
