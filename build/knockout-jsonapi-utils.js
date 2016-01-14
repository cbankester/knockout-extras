(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('knockout'), require('moment')) :
    typeof define === 'function' && define.amd ? define(['knockout', 'moment'], factory) :
    (global.KnockoutJsonApiUtils = factory(global.knockout,global.moment));
}(this, function (knockout,moment) { 'use strict';

    moment = 'default' in moment ? moment['default'] : moment;

    var babelHelpers_classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var babelHelpers_createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var babelHelpers_inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var babelHelpers_possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var babelHelpers_slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    var babelHelpers_toArray = function (arr) {
      return Array.isArray(arr) ? arr : Array.from(arr);
    };

    var babelHelpers_toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    var humanizeDuration = (function (module) {
    var exports = module.exports;
    // HumanizeDuration.js - http://git.io/j0HgmQ

    (function(global) {
      var languages = {
        ar: {
          y: function(c) { return c === 1 ? "سنة" : "سنوات"; },
          mo: function(c) { return c === 1 ? "شهر" : "أشهر"; },
          w: function(c) { return c === 1 ? "أسبوع" : "أسابيع"; },
          d: function(c) { return c === 1 ? "يوم" : "أيام"; },
          h: function(c) { return c === 1 ? "ساعة" : "ساعات"; },
          m: function(c) { return c === 1 ? "دقيقة" : "دقائق"; },
          s: function(c) { return c === 1 ? "ثانية" : "ثواني"; },
          ms: function(c) { return c === 1 ? "جزء من الثانية" : "أجزاء من الثانية"; },
          decimal: ","
        },
        ca: {
          y: function(c) { return "any" + (c !== 1 ? "s" : ""); },
          mo: function(c) { return "mes" + (c !== 1 ? "os" : ""); },
          w: function(c) { return "setman" + (c !== 1 ? "es" : "a"); },
          d: function(c) { return "di" + (c !== 1 ? "es" : "a"); },
          h: function(c) { return "hor" + (c !== 1 ? "es" : "a"); },
          m: function(c) { return "minut" + (c !== 1 ? "s" : ""); },
          s: function(c) { return "segon" + (c !== 1 ? "s" : ""); },
          ms: function(c) { return "milisegon" + (c !== 1 ? "s" : ""); },
          decimal: ","
        },
        cs: {
          y: function(c) { return ["rok", "roku", "roky", "let"][getCzechForm(c)]; },
          mo: function(c) { return ["měsíc", "měsíce", "měsíce", "měsíců"][getCzechForm(c)]; },
          w: function(c) { return ["týden", "týdne", "týdny", "týdnů"][getCzechForm(c)]; },
          d: function(c) { return ["den", "dne", "dny", "dní"][getCzechForm(c)]; },
          h: function(c) { return ["hodina", "hodiny", "hodiny", "hodin"][getCzechForm(c)]; },
          m: function(c) { return ["minuta", "minuty", "minuty", "minut"][getCzechForm(c)]; },
          s: function(c) { return ["sekunda", "sekundy", "sekundy", "sekund"][getCzechForm(c)]; },
          ms: function(c) { return ["milisekunda", "milisekundy", "milisekundy", "milisekund"][getCzechForm(c)]; },
          decimal: ","
        },
        da: {
          y: "år",
          mo: function(c) { return "måned" + (c !== 1 ? "er" : ""); },
          w: function(c) { return "uge" + (c !== 1 ? "r" : ""); },
          d: function(c) { return "dag" + (c !== 1 ? "e" : ""); },
          h: function(c) { return "time" + (c !== 1 ? "r" : ""); },
          m: function(c) { return "minut" + (c !== 1 ? "ter" : ""); },
          s: function(c) { return "sekund" + (c !== 1 ? "er" : ""); },
          ms: function(c) { return "millisekund" + (c !== 1 ? "er" : ""); },
          decimal: ","
        },
        de: {
          y: function(c) { return "Jahr" + (c !== 1 ? "e" : ""); },
          mo: function(c) { return "Monat" + (c !== 1 ? "e" : ""); },
          w: function(c) { return "Woche" + (c !== 1 ? "n" : ""); },
          d: function(c) { return "Tag" + (c !== 1 ? "e" : ""); },
          h: function(c) { return "Stunde" + (c !== 1 ? "n" : ""); },
          m: function(c) { return "Minute" + (c !== 1 ? "n" : ""); },
          s: function(c) { return "Sekunde" + (c !== 1 ? "n" : ""); },
          ms: function(c) { return "Millisekunde" + (c !== 1 ? "n" : ""); },
          decimal: ","
        },
        en: {
          y: function(c) { return "year" + (c !== 1 ? "s" : ""); },
          mo: function(c) { return "month" + (c !== 1 ? "s" : ""); },
          w: function(c) { return "week" + (c !== 1 ? "s" : ""); },
          d: function(c) { return "day" + (c !== 1 ? "s" : ""); },
          h: function(c) { return "hour" + (c !== 1 ? "s" : ""); },
          m: function(c) { return "minute" + (c !== 1 ? "s" : ""); },
          s: function(c) { return "second" + (c !== 1 ? "s" : ""); },
          ms: function(c) { return "millisecond" + (c !== 1 ? "s" : ""); },
          decimal: "."
        },
        es: {
          y: function(c) { return "año" + (c !== 1 ? "s" : ""); },
          mo: function(c) { return "mes" + (c !== 1 ? "es" : ""); },
          w: function(c) { return "semana" + (c !== 1 ? "s" : ""); },
          d: function(c) { return "día" + (c !== 1 ? "s" : ""); },
          h: function(c) { return "hora" + (c !== 1 ? "s" : ""); },
          m: function(c) { return "minuto" + (c !== 1 ? "s" : ""); },
          s: function(c) { return "segundo" + (c !== 1 ? "s" : ""); },
          ms: function(c) { return "milisegundo" + (c !== 1 ? "s" : ""); },
          decimal: ","
        },
        fr: {
          y: function(c) { return "an" + (c !== 1 ? "s" : ""); },
          mo: "mois",
          w: function(c) { return "semaine" + (c !== 1 ? "s" : ""); },
          d: function(c) { return "jour" + (c !== 1 ? "s" : ""); },
          h: function(c) { return "heure" + (c !== 1 ? "s" : ""); },
          m: function(c) { return "minute" + (c !== 1 ? "s" : ""); },
          s: function(c) { return "seconde" + (c !== 1 ? "s" : ""); },
          ms: function(c) { return "milliseconde" + (c !== 1 ? "s" : ""); },
          decimal: ","
        },
        gr: {
          y: function(c) { return c === 1 ? "χρόνος" : "χρόνια"; },
          mo: function(c) { return c === 1 ? "μήνας" : "μήνες"; },
          w: function(c) { return c === 1 ? "εβδομάδα" : "εβδομάδες"; },
          d: function(c) { return c === 1 ? "μέρα" : "μέρες"; },
          h: function(c) { return c === 1 ? "ώρα" : "ώρες"; },
          m: function(c) { return c === 1 ? "λεπτό" : "λεπτά"; },
          s: function(c) { return c === 1 ? "δευτερόλεπτο" : "δευτερόλεπτα"; },
          ms: function(c) { return c === 1 ? "χιλιοστό του δευτερολέπτου" : "χιλιοστά του δευτερολέπτου"; },
          decimal: ","
        },
        hu: {
          y: "év",
          mo: "hónap",
          w: "hét",
          d: "nap",
          h: "óra",
          m: "perc",
          s: "másodperc",
          ms: "ezredmásodperc",
          decimal: ","
        },
        it: {
          y: function(c) { return "ann" + (c !== 1 ? "i" : "o"); },
          mo: function(c) { return "mes" + (c !== 1 ? "i" : "e"); },
          w: function(c) { return "settiman" + (c !== 1 ? "e" : "a"); },
          d: function(c) { return "giorn" + (c !== 1 ? "i" : "o"); },
          h: function(c) { return "or" + (c !== 1 ? "e" : "a"); },
          m: function(c) { return "minut" + (c !== 1 ? "i" : "o"); },
          s: function(c) { return "second" + (c !== 1 ? "i" : "o"); },
          ms: function(c) { return "millisecond" + (c !== 1 ? "i" : "o"); },
          decimal: ","
        },
        ja: {
          y: "年",
          mo: "月",
          w: "週",
          d: "日",
          h: "時間",
          m: "分",
          s: "秒",
          ms: "ミリ秒",
          decimal: "."
        },
        ko: {
          y: "년",
          mo: "개월",
          w: "주일",
          d: "일",
          h: "시간",
          m: "분",
          s: "초",
          ms: "밀리 초",
          decimal: "."
        },
        nl: {
          y: "jaar",
          mo: function(c) { return c === 1 ? "maand" : "maanden"; },
          w: function(c) { return c === 1 ? "week" : "weken"; },
          d: function(c) { return c === 1 ? "dag" : "dagen"; },
          h: "uur",
          m: function(c) { return c === 1 ? "minuut" : "minuten"; },
          s: function(c) { return c === 1 ? "seconde" : "seconden"; },
          ms: function(c) { return c === 1 ? "milliseconde" : "milliseconden"; },
          decimal: ","
        },
        no: {
          y: "år",
          mo: function(c) { return "måned" + (c !== 1 ? "er" : ""); },
          w: function(c) { return "uke" + (c !== 1 ? "r" : ""); },
          d: function(c) { return "dag" + (c !== 1 ? "er" : ""); },
          h: function(c) { return "time" + (c !== 1 ? "r" : ""); },
          m: function(c) { return "minutt" + (c !== 1 ? "er" : ""); },
          s: function(c) { return "sekund" + (c !== 1 ? "er" : ""); },
          ms: function(c) { return "millisekund" + (c !== 1 ? "er" : ""); },
          decimal: ","
        },
        pl: {
          y: function(c) { return ["rok", "roku", "lata", "lat"][getPolishForm(c)]; },
          mo: function(c) { return ["miesiąc", "miesiąca", "miesiące", "miesięcy"][getPolishForm(c)]; },
          w: function(c) { return ["tydzień", "tygodnia", "tygodnie", "tygodni"][getPolishForm(c)]; },
          d: function(c) { return ["dzień", "dnia", "dni", "dni"][getPolishForm(c)]; },
          h: function(c) { return ["godzina", "godziny", "godziny", "godzin"][getPolishForm(c)]; },
          m: function(c) { return ["minuta", "minuty", "minuty", "minut"][getPolishForm(c)]; },
          s: function(c) { return ["sekunda", "sekundy", "sekundy", "sekund"][getPolishForm(c)]; },
          ms: function(c) { return ["milisekunda", "milisekundy", "milisekundy", "milisekund"][getPolishForm(c)]; },
          decimal: ","
        },
        pt: {
          y: function(c) { return "ano" + (c !== 1 ? "s" : ""); },
          mo: function(c) { return c !== 1 ? "meses" : "mês"; },
          w: function(c) { return "semana" + (c !== 1 ? "s" : ""); },
          d: function(c) { return "dia" + (c !== 1 ? "s" : ""); },
          h: function(c) { return "hora" + (c !== 1 ? "s" : ""); },
          m: function(c) { return "minuto" + (c !== 1 ? "s" : ""); },
          s: function(c) { return "segundo" + (c !== 1 ? "s" : ""); },
          ms: function(c) { return "milissegundo" + (c !== 1 ? "s" : ""); },
          decimal: ","
        },
        ru: {
          y: function(c) { return ["лет", "год", "года"][getSlavicForm(c)]; },
          mo: function(c) { return ["месяцев", "месяц", "месяца"][getSlavicForm(c)]; },
          w: function(c) { return ["недель", "неделя", "недели"][getSlavicForm(c)]; },
          d: function(c) { return ["дней", "день", "дня"][getSlavicForm(c)]; },
          h: function(c) { return ["часов", "час", "часа"][getSlavicForm(c)]; },
          m: function(c) { return ["минут", "минута", "минуты"][getSlavicForm(c)]; },
          s: function(c) { return ["секунд", "секунда", "секунды"][getSlavicForm(c)]; },
          ms: function(c) { return ["миллисекунд", "миллисекунда", "миллисекунды"][getSlavicForm(c)]; },
          decimal: ","
        },
        uk: {
          y: function(c) { return ["років", "рік", "роки"][getSlavicForm(c)]; },
          mo: function(c) { return ["місяців", "місяць", "місяці"][getSlavicForm(c)]; },
          w: function(c) { return ["неділь", "неділя", "неділі"][getSlavicForm(c)]; },
          d: function(c) { return ["днів", "день", "дні"][getSlavicForm(c)]; },
          h: function(c) { return ["годин", "година", "години"][getSlavicForm(c)]; },
          m: function(c) { return ["хвилин", "хвилина", "хвилини"][getSlavicForm(c)]; },
          s: function(c) { return ["секунд", "секунда", "секунди"][getSlavicForm(c)]; },
          ms: function(c) { return ["мілісекунд", "мілісекунда", "мілісекунди"][getSlavicForm(c)]; },
          decimal: ","
        },
        sv: {
          y: "år",
          mo: function(c) { return "månad" + (c !== 1 ? "er" : ""); },
          w: function(c) { return "veck" + (c !== 1 ? "or" : "a"); },
          d: function(c) { return "dag" + (c !== 1 ? "ar" : ""); },
          h: function(c) { return "timm" + (c !== 1 ? "ar" : "e"); },
          m: function(c) { return "minut" + (c !== 1 ? "er" : ""); },
          s: function(c) { return "sekund" + (c !== 1 ? "er" : ""); },
          ms: function(c) { return "millisekund" + (c !== 1 ? "er" : ""); },
          decimal: ","
        },
        tr: {
          y: "yıl",
          mo: "ay",
          w: "hafta",
          d: "gün",
          h: "saat",
          m: "dakika",
          s: "saniye",
          ms: "milisaniye",
          decimal: ","
        },
        zh_CN: {
          y: "年",
          mo: "个月",
          w: "周",
          d: "天",
          h: "小时",
          m: "分钟",
          s: "秒",
          ms: "毫秒",
          decimal: "."
        },
        zh_TW: {
          y: "年",
          mo: "個月",
          w: "周",
          d: "天",
          h: "小時",
          m: "分鐘",
          s: "秒",
          ms: "毫秒",
          decimal: "."
        }
      };

      // You can create a humanizer, which returns a function with defaults
      // parameters.
      function humanizer(passedOptions) {
        var result = function humanizer(ms, humanizerOptions) {
          var options = extend({}, result, humanizerOptions || {});
          return doHumanization(ms, options);
        };

        return extend(result, {
          language: "en",
          delimiter: ", ",
          spacer: " ",
          units: ["y", "mo", "w", "d", "h", "m", "s"],
          languages: {},
          round: false,
          unitMeasures: {
            y: 31557600000,
            mo: 2629800000,
            w: 604800000,
            d: 86400000,
            h: 3600000,
            m: 60000,
            s: 1000,
            ms: 1
          }
        }, passedOptions);
      }

      // The main function is just a wrapper around a default humanizer.
      var defaultHumanizer = humanizer({});
      function humanizeDuration() {
        return defaultHumanizer.apply(defaultHumanizer, arguments);
      }

      // doHumanization does the bulk of the work.
      function doHumanization(ms, options) {

        // Make sure we have a positive number.
        // Has the nice sideffect of turning Number objects into primitives.
        ms = Math.abs(ms);

        var dictionary = options.languages[options.language] || languages[options.language];
        if (!dictionary) {
          throw new Error("No language " + dictionary + ".");
        }

        var result = [];

        // Start at the top and keep removing units, bit by bit.
        var unitName, unitMS, unitCount;
        for (var i = 0, len = options.units.length; i < len; i++) {

          unitName = options.units[i];
          unitMS = options.unitMeasures[unitName];

          // What's the number of full units we can fit?
          if (i + 1 === len) {
            unitCount = ms / unitMS;
            if (options.round) {
              unitCount = Math.round(unitCount);
            }
          } else {
            unitCount = Math.floor(ms / unitMS);
          }

          // Add the string.
          if (unitCount) {
            result.push(render(unitCount, unitName, dictionary, options));
          }

          // Do we have enough units?
          if (options.largest && options.largest <= result.length) {
            break;
          }

          // Remove what we just figured out.
          ms -= unitCount * unitMS;

        }

        if (result.length) {
          return result.join(options.delimiter);
        } else {
          return render(0, options.units[options.units.length - 1], dictionary, options);
        }

      }

      function render(count, type, dictionary, options) {
        var decimal;
        if (options.decimal === void 0) {
          decimal = dictionary.decimal;
        } else {
          decimal = options.decimal;
        }

        var countStr = count.toString().replace(".", decimal);

        var dictionaryValue = dictionary[type];
        var word;
        if (typeof dictionaryValue === "function") {
          word = dictionaryValue(count);
        } else {
          word = dictionaryValue;
        }

        return countStr + options.spacer + word;
      }

      function extend(destination) {
        var source;
        for (var i = 1; i < arguments.length; i++) {
          source = arguments[i];
          for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
              destination[prop] = source[prop];
            }
          }
        }
        return destination;
      }

      // Internal helper function for Czech language.
      function getCzechForm(c) {
        if (c === 1) {
          return 0;
        } else if (Math.floor(c) !== c) {
          return 1;
        } else if (c % 10 >= 2 && c % 10 <= 4 && c % 100 < 10) {
          return 2;
        } else {
          return 3;
        }
      }

      // Internal helper function for Polish language.
      function getPolishForm(c) {
        if (c === 1) {
          return 0;
        } else if (Math.floor(c) !== c) {
          return 1;
        } else if (c % 10 >= 2 && c % 10 <= 4 && !(c % 100 > 10 && c % 100 < 20)) {
          return 2;
        } else {
          return 3;
        }
      }

      // Internal helper function for Russian and Ukranian languages.
      function getSlavicForm(c) {
        if (Math.floor(c) !== c) {
          return 2;
        } else if ((c >= 5 && c <= 20) || (c % 10 >= 5 && c % 10 <= 9) || c % 10 === 0) {
          return 0;
        } else if (c % 10 === 1) {
          return 1;
        } else if (c > 1) {
          return 2;
        } else {
          return 0;
        }
      }

      function getSupportedLanguages() {
        var result = [];
        for (var language in languages) {
          if (languages.hasOwnProperty(language)) {
            result.push(language);
          }
        }
        return result;
      }

      humanizeDuration.humanizer = humanizer;
      humanizeDuration.getSupportedLanguages = getSupportedLanguages;

      if (typeof define === "function" && define.amd) {
        define(function() {
          return humanizeDuration;
        });
      } else if (typeof module !== "undefined" && module.exports) {
        module.exports = humanizeDuration;
      } else {
        global.humanizeDuration = humanizeDuration;
      }
    })(this);
    return module.exports;
    })({exports:{}});

    var fraction = (function (module) {
    var exports = module.exports;
    /**
     * @license Fraction.js v3.0.0 09/09/2015
     * http://www.xarg.org/2014/03/precise-calculations-in-javascript/
     *
     * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
     * Dual licensed under the MIT or GPL Version 2 licenses.
     **/


    /**
     *
     * This class offers the possebility to calculate fractions.
     * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
     *
     * Array/Object form
     * [ 0 => <nominator>, 1 => <denominator> ]
     * [ n => <nominator>, d => <denominator> ]
     *
     * Integer form
     * - Single integer value
     *
     * Double form
     * - Single double value
     *
     * String form
     * 123.456 - a simple double
     * 123/456 - A string fraction
     * 123.'456' - a double with repeating decimal places
     * 123.(456) - synonym
     * 123.45'6' - a double with repeating last place
     * 123.45(6) - synonym
     *
     * Example:
     *
     * var f = new Fraction("9.4'31'");
     * f.mul([-4, 3]).div(4.9);
     *
     */

    (function(root) {

        "use strict";
        
        // Maximum search depth for cyclic rational numbers. 2000 should be more than enough. 
        // Example: 1/7 = 0.(142857) has 6 repeating decimal places.
        // When number gets reduced, long cycles will not be detected and toString() only gets the first 10 digits
        var MAX_CYCLE_LEN = 2000;

        // Parsed data to avoid calling "new" all the time
        var P = {
            "s": 1,
            "n": 0,
            "d": 1
        };

        function assign(n, s) {

            if (isNaN(n = parseInt(n, 10))) {
                thorwInvalidParam();
            }
            return n * s;
        }

        function thorwInvalidParam() {
            throw "Invalid Param";
        }

        var parse = function(p1, p2) {

            var n = 0, d = 1, s = 1;
            var v = 0, w = 0, x = 0, y = 1, z = 1;

            var A = 0, B = 1;
            var C = 1, D = 1;

            var N = 10000000;
            var M;

            if (p1 === undefined || p1 === null) {
                /* void */
            } else if (p2 !== undefined) {
                n = p1;
                d = p2;
                s = n * d;
            } else
                switch (typeof p1) {

                    case "object":
                    {
                        if ("d" in p1 && "n" in p1) {
                            n = p1["n"];
                            d = p1["d"];
                            if ("s" in p1)
                                n*= p1["s"];
                        } else if (0 in p1) {
                            n = p1[0];
                            if (1 in p1)
                                d = p1[1];
                        } else {
                            thorwInvalidParam();
                        }
                        s = n * d;
                        break;
                    }
                    case "number":
                    {
                        if (p1 < 0) {
                            s = p1;
                            p1 = -p1;
                        }

                        if (p1 % 1 === 0) {
                            n = p1;
                        } else if (p1 > 0) { // check for != 0, scale would become NaN (log(0)), which converges really slow

                            if (p1 >= 1) {
                                z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
                                p1/= z;
                            }

                            // Using Farey Sequences
                            // http://www.johndcook.com/blog/2010/10/20/best-rational-approximation/

                            while (B <= N && D <= N) {
                                M = (A + C) / (B + D);

                                if (p1 === M) {
                                    if (B + D <= N) {
                                        n = A + C;
                                        d = B + D;
                                    } else if (D > B) {
                                        n = C;
                                        d = D;
                                    } else {
                                        n = A;
                                        d = B;
                                    }
                                    break;

                                } else {

                                    if (p1 > M) {
                                        A+= C;
                                        B+= D;
                                    } else {
                                        C+= A;
                                        D+= B;
                                    }

                                    if (B > N) {
                                        n = C;
                                        d = D;
                                    } else {
                                        n = A;
                                        d = B;
                                    }
                                }
                            }
                            n*= z;
                        }
                        break;
                    }
                    case "string":
                    {
                        B = p1.match(/\d+|./g);

                        if (B[A] === '-') {// Check for minus sign at the beginning
                            s = -1;
                            A++;
                        } else if (B[A] === '+') {// Check for plus sign at the beginning
                            A++;
                        }

                        if (B.length === A + 1) { // Check if it's just a simple number "1234"
                            w = assign(B[A++], s);
                        } else if (B[A + 1] === '.' || B[A] === '.') { // Check if it's a decimal number

                            if (B[A] !== '.') { // Handle 0.5 and .5
                                v = assign(B[A++], s);
                            }
                            A++;

                            // Check for decimal places
                            if (A + 1 === B.length || B[A + 1] === '(' && B[A + 3] === ')' || B[A + 1] === "'" && B[A + 3] === "'") {
                                w = assign(B[A], s);
                                y = Math.pow(10, B[A].length);
                                A++;
                            }

                            // Check for repeating places
                            if (B[A] === '(' && B[A + 2] === ')' || B[A] === "'" && B[A + 2] === "'") {
                                x = assign(B[A + 1], s);
                                z = Math.pow(10, B[A + 1].length) - 1;
                                A+= 3;
                            }

                        } else if (B[A + 1] === '/' || B[A + 1] === ':') { // Check for a simple fraction "123/456" or "123:456"
                            w = assign(B[A], s);
                            y = assign(B[A + 2], 1);
                            A+= 3;
                        } else if (B[A + 3] === '/' && B[A + 1] === ' ') { // Check for a complex fraction "123 1/2"
                            v = assign(B[A], s);
                            w = assign(B[A + 2], s);
                            y = assign(B[A + 4], 1);
                            A+= 5;
                        }

                        if (B.length <= A) { // Check for more tokens on the stack
                            s = /* void */
                            n = x + z * (v * y + w);
                            d = y * z;
                            break;
                        }

                        /* Fall through on error */
                    }
                    default:
                        thorwInvalidParam();
                }

            if (!d) {
                throw "DIV/0";
            }

            P["s"] = s < 0 ? -1 : 1;
            P["n"] = Math.abs(n);
            P["d"] = Math.abs(d);
        };

        var modpow = function(b, e, m) {

            for (var r = 1; e > 0; b = (b * b) % m, e >>= 1) {

                if (e & 1) {
                    r = (r * b) % m;
                }
            }
            return r;
        };

        var cycleLen = function(n, d) {

            for (; d % 2 === 0; 
                d/= 2) {}

            for (; d % 5 === 0; 
                d/= 5) {}
            
            if (d === 1) // Catch non-cyclic numbers
                return 0;
                
            // If we would like to compute really large numbers quicker, we could make use of Fermat's little theorem:
            // 10^(d-1) % d == 1
            // However, we don't need such large numbers and MAX_CYCLE_LEN should be the capstone, 
            // as we want to translate the numbers to strings.

            var rem = 10 % d;

            for (var t = 1; rem !== 1; t++) {
                rem = rem * 10 % d;

                if (t > MAX_CYCLE_LEN)
                    return 0; // Returning 0 here means that we don't print it as a cyclic number. It's likely that the answer is `d-1`
            }
            return t;
        };

        var cycleStart = function(n, d, len) {

            var rem1 = 1;
            var rem2 = modpow(10, len, d);
            
            for (var t = 0; t < 300; t++) { // s < ~log10(Number.MAX_VALUE)
                // Solve 10^s == 10^(s+t) (mod d)

                if (rem1 === rem2)
                    return t;

                rem1 = rem1 * 10 % d;
                rem2 = rem2 * 10 % d;
            }
            return 0;
        };

        var gcd = function(a, b) {

            if (!a) return b;
            if (!b) return a;

            while (1) {
                a%= b;
                if (!a) return b;
                b%= a;
                if (!b) return a;
            }
        };

        /**
         * Module constructor
         *
         * @constructor
         * @param {number|Fraction} a
         * @param {number=} b
         */
        function Fraction(a, b) {

            if (!(this instanceof Fraction)) {
                return new Fraction(a, b);
            }

            parse(a, b);

            if (Fraction['REDUCE']) {
                a = gcd(P["d"], P["n"]); // Abuse a
            } else {
                a = 1;
            }

            this["s"] = P["s"];
            this["n"] = P["n"] / a;
            this["d"] = P["d"] / a;
        }

        /**
         * Boolean global variable to be able to disable automatic reduction of the fraction
         *
         */
        Fraction['REDUCE'] = 1;

        Fraction.prototype = {

            "s": 1,
            "n": 0,
            "d": 1,

            /**
             * Calculates the absolute value
             *
             * Ex: new Fraction(-4).abs() => 4
             **/
            "abs": function() {

                return new Fraction(this["n"], this["d"]);
            },

            /**
             * Inverts the sign of the current fraction
             *
             * Ex: new Fraction(-4).neg() => 4
             **/
            "neg": function() {

                return new Fraction(-this["s"] * this["n"], this["d"]);
            },

            /**
             * Adds two rational numbers
             *
             * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
             **/
            "add": function(a, b) {

                parse(a, b);
                return new Fraction(
                        this["s"] * this["n"] * P["d"] + P["s"] * this["d"] * P["n"],
                        this["d"] * P["d"]
                        );
            },

            /**
             * Subtracts two rational numbers
             *
             * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
             **/
            "sub": function(a, b) {

                parse(a, b);
                return new Fraction(
                        this["s"] * this["n"] * P["d"] - P["s"] * this["d"] * P["n"],
                        this["d"] * P["d"]
                        );
            },

            /**
             * Multiplies two rational numbers
             *
             * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
             **/
            "mul": function(a, b) {

                parse(a, b);
                return new Fraction(
                        this["s"] * P["s"] * this["n"] * P["n"],
                        this["d"] * P["d"]
                        );
            },

            /**
             * Divides two rational numbers
             *
             * Ex: new Fraction("-17.(345)").inverse().div(3)
             **/
            "div": function(a, b) {

                parse(a, b);
                return new Fraction(
                        this["s"] * P["s"] * this["n"] * P["d"],
                        this["d"] * P["n"]
                        );
            },

            /**
             * Clones the actual object
             *
             * Ex: new Fraction("-17.(345)").clone()
             **/
            "clone": function() {
                return new Fraction(this);
            },

            /**
             * Calculates the modulo of two rational numbers - a more precise fmod
             *
             * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
             **/
            "mod": function(a, b) {

                if (a === undefined) {
                    return new Fraction(this["s"] * this["n"] % this["d"], 1);
                }

                parse(a, b);
                if (0 === (P["n"] * this["d"])) {
                    Fraction(0, 0); // Throw div/0
                }

                /*
                 * First silly attempt, kinda slow
                 *
                 return that["sub"]({
                 "n": num["n"] * Math.floor((this.n / this.d) / (num.n / num.d)),
                 "d": num["d"],
                 "s": this["s"]
                 });*/

                /*
                 * New attempt: a1 / b1 = a2 / b2 * q + r
                 * => b2 * a1 = a2 * b1 * q + b1 * b2 * r
                 * => (b2 * a1 % a2 * b1) / (b1 * b2)
                 */
                return new Fraction(
                        (this["s"] * P["d"] * this["n"]) % (P["n"] * this["d"]),
                        P["d"] * this["d"]
                        );
            },

            /**
             * Calculates the fractional gcd of two rational numbers
             *
             * Ex: new Fraction(5,8).gcd(3,7) => 1/56
             */
            "gcd": function(a, b) {

                parse(a, b);

                // gcd(a / b, c / d) = gcd(a, c) / lcm(b, d)

                return new Fraction(gcd(P["n"], this["n"]), P["d"] * this["d"] / gcd(P["d"], this["d"]));
            },

            /**
             * Calculates the fractional lcm of two rational numbers
             *
             * Ex: new Fraction(5,8).lcm(3,7) => 15
             */
            "lcm": function(a, b) {

                parse(a, b);

                // lcm(a / b, c / d) = lcm(a, c) / gcd(b, d)

                return new Fraction(P["n"] * this["n"] / gcd(P["n"], this["n"]), gcd(P["d"], this["d"]));
            },

            /**
             * Calculates the ceil of a rational number
             *
             * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
             **/
            "ceil": function() {

                return new Fraction(Math.ceil(this["s"] * this["n"] / this["d"]), 1);
            },

            /**
             * Calculates the floor of a rational number
             *
             * Ex: new Fraction('4.(3)').floor() => (4 / 1)
             **/
            "floor": function() {

                return new Fraction(Math.floor(this["s"] * this["n"] / this["d"]), 1);
            },

            /**
             * Rounds a rational numbers
             *
             * Ex: new Fraction('4.(3)').round() => (4 / 1)
             **/
            "round": function() {

                return new Fraction(Math.round(this["s"] * this["n"] / this["d"]), 1);
            },

            /**
             * Gets the inverse of the fraction, means numerator and denumerator are exchanged
             *
             * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
             **/
            "inverse": function() {

                return new Fraction(this["s"] * this["d"], this["n"]);
            },

            /**
             * Calculates the fraction to some integer exponent
             *
             * Ex: new Fraction(-1,2).pow(-3) => -8
             */
            "pow": function(m) {

                var d = this["d"];
                var n = this["n"];
                if (m < 0) {
                    this["d"] = Math.pow(n, -m);
                    this["n"] = Math.pow(d, -m);
                } else {
                    this["d"] = Math.pow(d, m);
                    this["n"] = Math.pow(n, m);
                }

                if (0 === (m % 2)) {
                    this["s"] = 1;
                }
                return this;
            },

            /**
             * Check if two rational numbers are the same
             *
             * Ex: new Fraction(19.6).equals([98, 5]);
             **/
            "equals": function(a, b) {

                parse(a, b);
                return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"]; // Same as compare() === 0
            },

            /**
             * Check if two rational numbers are the same
             *
             * Ex: new Fraction(19.6).equals([98, 5]);
             **/
            "compare": function(a, b) {

                parse(a, b);
                var t = (this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"]);
                return (0 < t) - (t < 0);
            },

            /**
             * Check if two rational numbers are divisible
             *
             * Ex: new Fraction(19.6).divisible(1.5);
             */
            "divisible": function(a, b) {

                parse(a, b);
                return !!(P["n"] * this["d"]) && !((this["n"] * P["d"]) % (P["n"] * this["d"]));
            },

            /**
             * Returns a decimal representation of the fraction
             *
             * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
             **/
            'valueOf': function() {

                return this["s"] * this["n"] / this["d"];
            },

            /**
             * Returns a string-fraction representation of a Fraction object
             *
             * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
             **/
            'toFraction': function(excludeWhole) {

                var whole, str = "";
                var n = this["n"];
                var d = this["d"];
                if (this["s"] < 0) {
                    str+= '-';
                }

                if (d === 1) {
                    str+= n;
                } else {

                    if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
                        str+= whole;
                        str+= " ";
                        n %= d;
                    }

                    str+= n;
                    str+= '/';
                    str+= d;
                }
                return str;
            },

            /**
             * Returns a latex representation of a Fraction object
             *
             * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
             **/
            'toLatex': function(excludeWhole) {

                var whole, str = "";
                var n = this["n"];
                var d = this["d"];
                if (this["s"] < 0) {
                    str+= '-';
                }

                if (d === 1) {
                    str+= n;
                } else {
                    
                    if (excludeWhole && (whole = Math.floor(n / d)) > 0) {		
                        str+= whole;		
                        n %= d;		
                    }

                    str+= "\\frac{";
                    str+= n;
                    str+= '}{';
                    str+= d;
                    str+= '}';
                }
                return str;
            },

            /**
             * Creates a string representation of a fraction with all digits
             *
             * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
             **/
            'toString': function() {

                var g;
                var N = this["n"];
                var D = this["d"];

                if (!Fraction['REDUCE']) {
                    g = gcd(N, D);
                    N/= g;
                    D/= g;
                }

                var p = String(N).split(""); // Numerator chars
                var t = 0; // Tmp var

                var ret = [~this["s"] ? "" : "-", "", ""]; // Return array, [0] is zero sign, [1] before comma, [2] after
                var zeros = ""; // Collection variable for zeros

                var cycLen = cycleLen(N, D); // Cycle length
                var cycOff = cycleStart(N, D, cycLen); // Cycle start

                var j = -1;
                var n = 1; // str index

                // rough estimate to fill zeros
                var length = 10 + cycLen + cycOff + p.length; // 10 = decimal places when no repitation

                for (var i = 0; i < length; i++, t*= 10) {

                    if (i < p.length) {
                        t+= Number(p[i]);
                    } else {
                        n = 2;
                        j++; // Start now => after comma
                    }

                    if (cycLen > 0) { // If we have a repeating part
                        if (j === cycOff) {
                            ret[n]+= zeros + "(";
                            zeros = "";
                        } else if (j === cycLen + cycOff) {
                            ret[n]+= zeros + ")";
                            break;
                        }
                    }

                    if (t >= D) {
                        ret[n]+= zeros + ((t / D) | 0); // Flush zeros, Add current digit
                        zeros = "";
                        t = t % D;
                    } else if (n > 1) { // Add zeros to the zero buffer
                        zeros+= "0";
                    } else if (ret[n]) { // If before comma, add zero only if already something was added
                        ret[n]+= "0";
                    }
                }

                // If it's empty, it's a leading zero only
                ret[0]+= ret[1] || "0";

                // If there is something after the comma, add the comma sign
                if (ret[2]) {
                    return ret[0] + "." + ret[2];
                }
                return ret[0];
            }
        };

        if (typeof define === "function" && define["amd"]) {
            define([], function() {
                return Fraction;
            });
        } else if (typeof exports === "object") {
            module["exports"] = Fraction;
        } else {
            root['Fraction'] = Fraction;
        }

    })(this);
    return module.exports;
    })({exports:{}});

    function _get_included(included) {
      return function (_ref) {
        var id = _ref.id;
        var type = _ref.type;
        return included.find(function (v) {
          return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
        });
      };
    }

    function _build_relationship(vm, get_included_record) {
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
    }

    function _init_relationship(vm, client_defined_relationships) {
      return function (_ref3) {
        var _ref4 = babelHelpers_slicedToArray(_ref3, 2);

        var rel_name = _ref4[0];
        var rel_data = _ref4[1];
        return init_relationship(vm, rel_name, rel_data, client_defined_relationships);
      };
    }

    function _remap_with_included_records(record) {
      var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var get_included_record = _ref5.get_included_record;
      var immybox = _ref5.immybox;
      var nested_immybox_relationships = _ref5.nested_immybox_relationships;

      var ret = get_included_record ? get_included_record(record) || record : record;

      Object.assign(ret, ret.attributes, {
        id: Number.parseInt(ret.id, 10),
        type: ret.type
      });

      if (ret.relationships) {
        var relationships = ret.relationships;

        var _loop = function _loop(relationship_name) {
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

      immybox && Object.assign(ret, {
        value: ret[immybox.value || 'id'],
        text: ret[immybox.text || 'name']
      });

      return ret;
    }

    function _encode_uri(url, obj) {
      if (Object.keys(obj).length === 0) return url;
      var str = '';
      for (var key in obj) {
        if (str !== '') str += '&';
        str += key + '=' + encodeURIComponent(obj[key]);
      }
      return url + '?' + str;
    }

    function _base_request(resolve, reject) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState === 4) // done
          if (this.status >= 200 && this.status < 400) try {
            resolve(JSON.parse(this.response || 'null'));
          } catch (e) {
            resolve(null);
          } else reject(this);
      };
      request.onerror = function () {
        reject(this);
      };
      return request;
    }

    var RequestError = function (_Error) {
      babelHelpers_inherits(RequestError, _Error);

      function RequestError(xhr) {
        babelHelpers_classCallCheck(this, RequestError);

        var message = undefined,
            errors_from_server = undefined,
            json = undefined,
            responseText = undefined;
        var name = 'RequestError';

        try {
          json = JSON.parse(xhr.responseText || 'null');
        } catch (e) {
          json = null;
        } finally {
          if (xhr.responseText) responseText = xhr.responseText;
        }

        if (json && json.errors) {
          errors_from_server = json.errors;
          if (json.errors.length === 1) message = json.errors[0].title;
        }
        if (!message) message = xhr.statusText || 'An error occurred while sending the request';

        var _this = babelHelpers_possibleConstructorReturn(this, Object.getPrototypeOf(RequestError).call(this, message));

        _this.message = message;
        _this.name = name;
        _this.status = xhr.status;
        if (errors_from_server) _this.errors_from_server = errors_from_server;
        if (responseText) _this.responseText = responseText;
        return _this;
      }

      return RequestError;
    }(Error);

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
      delete: function _delete(req) {
        if (req instanceof Array) return Promise.all(req.map(function (elem) {
          return httpJSON.patch(elem);
        }));
        if (typeof req === 'string') return httpJSON.delete({ url: req });
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

    function create_observable(vm, attr_name, attr_val) {
      return vm[attr_name] = knockout.observable().extend({
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
      var obs = vm[rel_name] || (vm[rel_name] = rel_data instanceof Array ? knockout.observableArray([]) : knockout.observable());

      if (client_defined_relationship && client_defined_relationship.allow_destroy) vm['non_deleted_' + rel_name] = knockout.computed(function () {
        return obs().filter(function (obj) {
          return obj.loading ? !obj.loading() && !obj.marked_for_deletion() : !obj.marked_for_deletion();
        });
      });

      return Promise.resolve({ rel_name: rel_name, rel_data: rel_data, client_defined_relationship: client_defined_relationship, obs: obs });
    }
    function build_relationship(vm, rel_name, rel_data, obs) {
      var _ref6 = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

      var client_defined_relationship = _ref6.client_defined_relationship;
      var get_included_record = _ref6.get_included_record;

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

          if (client_defined_relationship.class) {
            (function () {
              var klass = client_defined_relationship.class;

              records = records.map(function (r) {
                return new klass(vm, r);
              });

              if (klass.prototype.doneLoading) done = Promise.all(records.map(function (r) {
                return r.doneLoading();
              }));

              if (client_defined_relationship.blank_value) obs.extend({
                pushable: {
                  klass: klass,
                  this_arg: vm,
                  args: [client_defined_relationship.blank_value]
                }
              });
            })();
          }
        }
        obs(records);
      } else if (rel_data) {
        var remapped = _remap_with_included_records(rel_data, { get_included_record: get_included_record });
        var record = undefined;

        if (client_defined_relationship) {
          if (client_defined_relationship.nested_attributes_accepted) obs.extend({
            nestable: rel_name,
            watch_for_pending_changes: true
          });
          if (client_defined_relationship.class) {
            var klass = client_defined_relationship.class;
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
          if (client_defined_relationship.class) {
            var klass = client_defined_relationship.class;
            var blank_value = client_defined_relationship.blank_value || {};

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
      var _ref7 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var get_included_record = _ref7.get_included_record;
      var client_defined_relationships = _ref7.client_defined_relationships;

      return Promise.all([].concat(babelHelpers_toConsumableArray(relationships_map)).map(_init_relationship(vm, client_defined_relationships))).then(function (resolutions) {
        return Promise.all(resolutions.map(_build_relationship(vm, get_included_record)));
      });
    }

    function create_relationship(vm, rel_name, rel_data) {
      var _ref8 = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var get_included_record = _ref8.get_included_record;
      var client_defined_relationships = _ref8.client_defined_relationships;

      return init_relationship(vm, rel_name, rel_data, client_defined_relationships).then(_build_relationship(vm, get_included_record));
    }

var json_api_utils = Object.freeze({
      RequestError: RequestError,
      httpJSON: httpJSON,
      create_observable: create_observable,
      parse_json_api_response: parse_json_api_response,
      init_relationship: init_relationship,
      build_relationship: build_relationship,
      create_relationships: create_relationships,
      create_relationship: create_relationship
    });

    /*eslint no-unused-vars: 0, no-console: 0 */

    function noOp() {}

    function _get_included$1(included) {
      return function (_ref) {
        var id = _ref.id;
        var type = _ref.type;
        return included.find(function (v) {
          return Number.parseInt(v.id, 10) === Number.parseInt(id, 10) && v.type === type;
        });
      };
    }

    function _initKOFormVMFromJsonApiResponse(vm, response) {
      var record = response.data;
      var client_defined_relationships = vm.options.relationships;
      var server_defined_relationships = record.relationships || {};
      var server_defined_attributes = record.attributes || {};
      var get_included_record = response.included && _get_included$1(response.included) || null;
      var observable_attributes_blacklist = vm.options.observable_attributes_blacklist || [];

      vm.id = record.id;
      vm.id && (vm.id = Number.parseInt(vm.id, 10));
      vm.type = record.type;

      vm._url = vm.url = server_defined_attributes.url;
      delete server_defined_attributes.url;

      var attribute_names = Object.keys(server_defined_attributes);

      attribute_names.forEach(function (attribute_name) {
        if (observable_attributes_blacklist.includes(attribute_name)) {
          vm[attribute_name] = server_defined_attributes[attribute_name];
        } else {
          vm.observables_list.push(create_observable(vm, attribute_name, server_defined_attributes[attribute_name]));
        }
      });

      var relationship_names = Object.keys(server_defined_relationships);

      return Promise.all(relationship_names.map(function (key) {
        return init_relationship(vm, key, server_defined_relationships[key].data, client_defined_relationships);
      })).then(function (relationship_params) {
        return Promise.all(relationship_params.map(function (_ref2) {
          var rel_name = _ref2.rel_name;
          var rel_data = _ref2.rel_data;
          var obs = _ref2.obs;
          var client_defined_relationship = _ref2.client_defined_relationship;

          vm.relationships.push(obs);
          return build_relationship(vm, rel_name, rel_data, obs, {
            get_included_record: get_included_record,
            client_defined_relationship: client_defined_relationship
          });
        }));
      });
    }

    function _initNestedVMs(vm, vm_map) {
      return vm_map && Promise.all([].concat(babelHelpers_toConsumableArray(vm_map)).map(function (_ref3) {
        var _ref4 = babelHelpers_slicedToArray(_ref3, 2);

        var nested_vm_name = _ref4[0];
        var nested_vm = _ref4[1];

        vm[nested_vm_name] = nested_vm;
        nested_vm.error_message.subscribe(vm.error_message);
        return nested_vm.doneLoading();
      })) || Promise.resolve();
    }

    function _sendRequests(requests) {
      return httpJSON.get(requests).catch(function (xhr) {
        throw new RequestError(xhr);
      });
    }

    var KOFormBase = function () {
      babelHelpers_createClass(KOFormBase, [{
        key: 'init',
        value: function init(opts) {
          var _this = this;

          if (this.init_begun || this.init_finalized) throw new Error('Cannot init more than once');

          if (!opts.url) throw new Error('Please provide a URL');
          this.init_begun = true;

          var _options = this.options = opts;

          var url = _options.url;
          var request_opts = _options.request_opts;
          var other_requests = _options.other_requests;

          var requests = [{ url: url, data: Object.assign({}, request_opts) }].concat(babelHelpers_toConsumableArray((other_requests || []).map(function (req) {
            return typeof req === 'string' ? { url: req, data: {} } : {
              url: req.url,
              data: Object.assign({}, req.request_opts)
            };
          })));
          return Promise.all([_sendRequests(requests), _initNestedVMs(this, opts.nested_vms)]).then(function (_ref5) {
            var _ref6 = babelHelpers_slicedToArray(_ref5, 1);

            var _ref6$ = babelHelpers_toArray(_ref6[0]);

            var main_response = _ref6$[0];

            var other_responses = _ref6$.slice(1);

            return _initKOFormVMFromJsonApiResponse(_this, main_response).then(function () {
              return Promise.all([other_responses.length && _this.handleOtherRequests(other_responses) || Promise.resolve(), _this.finalizeInit()]);
            });
          }).then(function () {
            return delete _this.init_begun;
          });
        }
      }, {
        key: 'handleOtherRequests',
        value: function handleOtherRequests(responses) {
          // Overload this method to handle responses
        }
      }, {
        key: 'finalizeInit',
        value: function finalizeInit() {
          var _this2 = this;

          if (this.init_finalizing || this.init_finalized) throw new Error('Cannot finalize init more than once');

          this.init_finalizing = true;
          var errorable = this.observables_list.filter(function (obs) {
            return obs.hasError;
          });
          var observables_with_initial_values = this.observables_list.filter(function (obs) {
            return obs.initial_value || obs.initial_length;
          });
          this.errors = {};
          errorable.forEach(function (obs) {
            if (obs.postable_name) _this2.errors[obs.postable_name] = knockout.computed(function () {
              return obs.hasError() && obs.validationMessage() || null;
            });else if (obs.errorable_observables) _this2.errors[obs.errorable_name] = knockout.computed(function () {
              return obs.hasError() && obs.errors() || null;
            });
          });
          this.numErrors = this.numErrors || knockout.computed(function () {
            return errorable.reduce(function (total, obs) {
              return total + (obs.hasError() ? obs.numErrors ? obs.numErrors() : 1 : 0);
            }, 0);
          });

          this.is_valid = knockout.computed(function () {
            return !_this2.numErrors();
          }).extend({ notify: 'always' });

          this.no_changes_pending = knockout.computed(function () {
            var relationships_pendings = _this2.relationships.map(function (obs) {
              var c = obs.no_changes_pending;
              var l = obs.initial_length;

              return (c ? c() : true) && (l ? l() === obs().length : true);
            });

            var observable_value_pairs = observables_with_initial_values.map(function (obs) {
              return obs.initial_value ? obs() === obs.initial_value() : obs().length === obs.initial_length();
            });

            return relationships_pendings.every(function (p) {
              return p;
            }) && observable_value_pairs.every(function (p) {
              return p;
            });
          }).extend({ notify: 'always' });

          this.changes_pending = knockout.computed(function () {
            return !_this2.no_changes_pending();
          }).extend({ notify: 'always' });

          if (this.options.save_after_edit) {
            (function () {
              var reify_method = _this2.options.save_after_edit.reify_method;
              var should_save = knockout.computed(function () {
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
                  }).catch(function (err) {
                    if (typeof err === 'string') (_this2.options.on_validation_error || noOp)(err);else {
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
        babelHelpers_classCallCheck(this, KOFormBase);

        Object.assign(this, {
          loading: knockout.observable(true),
          attempted: knockout.observable(false),
          error_message: knockout.observable(null),
          observables_list: [],
          relationships: []
        });
      }

      babelHelpers_createClass(KOFormBase, [{
        key: 'saveAndReload',
        value: function saveAndReload() {
          var _this3 = this;

          var action = this.id ? 'update' : 'create';
          this.save().then(function (record) {
            successNotice({ notice: 'Record ' + action + 'd' });
            window.location = record && record.url ? record.url : _this3.url;
          }).catch(function (err) {
            if (typeof err === 'string') (_this3.options.on_validation_error || noOp)(err);else if (err instanceof Error) (_this3.options.on_error || noOp)(err);
          });
        }
      }, {
        key: 'save',
        value: function save() {
          var _this4 = this;

          return new Promise(function (resolve, reject) {
            _this4.attempted(true);
            var numErrors = _this4.numErrors();
            if (numErrors) {
              reject('There ' + (numErrors === 1 ? 'is 1 error which prevents' : 'are ' + numErrors + ' errors which prevent') + ' this form from being submitted.');
              return;
            }

            httpJSON[_this4.id ? 'patch' : 'post']({
              url: _this4.url,
              data: {
                data: {
                  id: _this4.id,
                  type: _this4.type,
                  attributes: _this4.serialize()
                }
              }
            }).then(function (response) {
              var record = parse_json_api_response(response);
              if (record) {
                _this4.id = record.id;
                _this4.url = record.url;
              }
              resolve(record);
            }).catch(function (xhr) {
              return reject(new RequestError(xhr));
            });
          });
        }
      }, {
        key: 'serialize',
        value: function serialize() {
          var json = {};
          this.observables_list.forEach(function (obs) {
            var pname = obs.postable_name;
            var nname = obs.nestable_name;
            var val = obs();

            if (pname) json[pname] = val instanceof Date ? val.toISOString() : val;else if (nname) json[nname] = obs.initial_length ? val.map(_serialize) : val.serialize();
          });

          this.relationships.forEach(function (obs) {
            var nname = obs.nestable_name;
            var val = obs();
            if (nname) json[nname] = obs.initial_length ? val.map(_serialize) : val.serialize();
          });
          return json;
        }
      }, {
        key: 'unsetObservables',
        value: function unsetObservables() {
          delete this.id;
          this.url = this._url;
          this.observables_list.forEach(function (obs) {
            return obs('push' in obs ? [] : undefined);
          });
          this.attempted(false);
        }
      }, {
        key: 'doneLoading',
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
              _this5.error_message() ? reject(_this5.error_message()) : resolve();
            });
          }) || Promise.resolve();
        }
      }]);
      return KOFormBase;
    }();

    var extenders = {};

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
      target.dispose_sub_observables = function () {
        return setTimeout(function () {
          target.disposables.forEach(dispose);
        });
      };
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
      function extender(target) {
        var applied_extenders = target.applied_extenders || [];
        if (opts && opts.incompatible_extenders && applied_extenders.length) {
          opts.incompatible_extenders.forEach(function (incompatible_extender) {
            if (~applied_extenders.indexOf(incompatible_extender)) {
              throw new Error('KO Extender ' + extender_name + ' is not compatible with ' + incompatible_extender);
            }
          });
        }
        applied_extenders.push(extender_name);
        target.applied_extenders = applied_extenders;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return extender_fn.apply(undefined, [target].concat(args));
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
      var result = knockout.pureComputed({
        read: target,
        write: function write(new_val) {
          if (new_val) {
            var current = target();
            var val_to_write = sanitize_fn(new_val);

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
      }).extend({ notify: 'always' });

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
      return { type: type, observable: knockout.observable() };
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
      target.errors = knockout.observableArray([]);

      // hasError: true if one of the validations on this observable fails
      target.hasError = knockout.computed(function () {
        return target.errors().some(function (_ref) {
          var o = _ref.observable;
          return o();
        });
      });
      target.disposables.push(target.hasError);

      // validationMessage: the message from the first failing validation
      target.validationMessage = knockout.computed(function () {
        var first_invalid = target.errors().find(function (_ref2) {
          var o = _ref2.observable;
          return o();
        });
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

    setupExtender('initial_value', function (target, init_val) {
      setupObservableDisposables(target);

      // so we can track when the sanitizer is being called repeatedly
      var sanitize_count = 0;
      var first_pass_unsanitized_value = null;

      var initial_value_observable = knockout.observable().extend({ notify: 'always' });

      function sanitizeAndInitializeTarget(new_val) {
        // pass val through target's sanitizer, if it exists.
        var val = target.sanitize ? target.sanitize(new_val) : new_val;
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
              target: target,
              first_pass_unsanitized_value: first_pass_unsanitized_value,
              second_pass_unsanitized_value: val
            });
          }

          sanitize_count += 1;
          // set target to the sanitized value and re-initialize
          target(val);
          first_pass_unsanitized_value = new_val;
          sanitizeAndInitializeTarget(val);
        } else {

          // Update target.initial_value if it's not already. Doing so will trigger
          // sanitizeAndInitializeTarget to run again, but when it does, this check
          // will not pass, and the chain of events will stop
          sanitize_count = 0;
          // target's value is sanitized
          // unset our counter and first unsanitized value, if they're set

          first_pass_unsanitized_value = null;
          val !== target.initial_value() && target.initial_value(val);
        }
      }
      if (target.initial_value) {
        var index = target.disposables.indexOf(target.initial_value);
        if (~index) {
          var _target$disposables$s = target.disposables.splice(index, 1);

          var _target$disposables$s2 = babelHelpers_slicedToArray(_target$disposables$s, 1);

          var old_computed = _target$disposables$s2[0];

          old_computed && old_computed.dispose();
        }
      }

      target.initial_value = knockout.computed({
        read: initial_value_observable,
        write: function write(new_val) {
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

    setupExtender('postable', function (target, postable_name) {
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

    setupExtender('initial_length', function (target, initial_length) {
      target.initial_length = knockout.observable(initial_length);
      return target;
    });

    /**
     * Subscribes fn to target
     * @name ko.extenders.after_change
     * @param {ko.observable} target
     * @param {Function} fn
     * @return {ko.observable} The extended target
    */

    setupExtender('after_change', function (target, fn) {
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

    setupExtender('before_change', function (target, fn) {
      setupObservableDisposables(target);
      target.disposables.push(target.subscribe(fn, null, 'beforeChange'));
      return target;
    });

    function fakeEnable() {
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

    setupExtender('required', function (target, opts) {
      var validation_obj = setupValidationObservables(target)('required');
      var message = undefined,
          enabled = undefined;

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

      enabled.subscribe && target.disposables.push(enabled.subscribe(function () {
        return validate(target());
      }));

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

    setupExtender('email', function (target, message) {
      var validation_obj = setupValidationObservables(target)('email');
      target.errors.push(validation_obj);

      var re = new RegExp(/^\S+@\S+\.\S+$/);

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

    setupExtender('phone', function (target, message) {
      var validation_obj = setupValidationObservables(target)('phone');
      target.errors.push(validation_obj);
      var re = new RegExp(/^((\d)?(\d{3}))?(\d{3})(\d{4})$/);

      function validate(new_val) {
        if (new_val && typeof new_val === 'string') {
          var matches = new_val.replace(/[+()\s.-]*/g, '').match(re);
          if (matches) {
            if (matches[2]) {
              validation_obj.observable(message || 'Invalid phone number. Must be 10 digits');
            } else if (matches[3]) {
              target('(' + matches[3] + ') ' + matches[4] + '-' + matches[5]);
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

    setupExtender('unique', function (target, opts) {
      if (!opts) {
        throw new Error('Cannot determine uniqueness of target without opts.uniq_in and opts.attribute_name');
      }

      var _ref3 = opts || {};

      var uniq_in = _ref3.uniq_in;
      var attribute_name = _ref3.attribute_name;
      var message = _ref3.message;

      var validation_obj = setupValidationObservables(target)('unique');
      target.errors.push(validation_obj);

      function validate(mapped_array) {
        var val = target();
        if (val || val === 0) {
          var duplicated = mapped_array.filter(function (attr) {
            return attr === val;
          }).length > 1;
          if (duplicated) {
            validation_obj.observable(message || 'Must be unique');
          } else {
            validation_obj.observable(null);
          }
        } else {
          validation_obj.observable(null);
        }
      }

      var mapped_array = knockout.computed(function () {
        return knockout.unwrap(uniq_in).map(function (obj) {
          return knockout.unwrap(obj[attribute_name]);
        });
      });

      var computed_subscriber = mapped_array.subscribe(validate);

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
      var _ref4 = opts || {};

      var precision = _ref4.precision;
      var sign = _ref4.sign;
      var default_val = _ref4.default;
      var allow_rational = _ref4.allow_rational;

      var multiplier = precision && Math.pow(10, precision) || null;
      var disallow_imprecision = multiplier && opts.allow_imprecision === false || false;

      function stripDisallowedCharacters(value) {
        if (allow_rational) {
          return value && String(value).replace(/[^\d\.\/]/g, '') || null;
        }
        return value && String(value).replace(/[^\d\.]/g, '') || null;
      }

      function sanitize(value) {
        var out = stripDisallowedCharacters(value);

        if (out === null && (default_val || default_val === 0)) {
          out = String(default_val);
        }

        if (out) {
          var is_rational = Boolean(~out.indexOf('/'));
          try {
            is_rational && (out = new fraction(out));
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
      Object.assign(target, { sanitize: sanitize });

      return computedSanitizeProxy(target, sanitize);
    }, {
      incompatible_extenders: ['duration', 'time']
    });

    var days_in_year = 365;
    var days_in_month = 30;
    var days_in_week = 7;

    var millis_in_second = 1000;
    var millis_in_minute = 60 * millis_in_second;
    var millis_in_hour = 60 * millis_in_minute;
    var millis_in_day = 24 * millis_in_hour;
    var millis_in_week = days_in_week * millis_in_day;
    var millis_in_month = days_in_month * millis_in_day;
    var millis_in_year = days_in_year * millis_in_day;

    /**
     * Returns the number of milliseconds represented by the human-readable date `str`
     *
     * E.g. `str === "1 year 2 months 3 weeks 4 days 5 hours 6 minutes 7 seconds"`
     * @param {string} str - The string to parse into milliseconds
     * @private
     * @return {number} The milliseconds parsed from str
    */

    function getMillisecondsFromString(str) {
      var millis = 0;
      if (str.match(/[^\d\.]/)) {
        // string contains non-number characters
        var tmp = undefined;
        var years = (tmp = str.match(/((\d*\.)?\d+)\s*y/i)) && tmp[1] || 0;
        var months = (tmp = str.match(/((\d*\.)?\d+)\s*mo/i)) && tmp[1] || 0;
        var weeks = (tmp = str.match(/((\d*\.)?\d+)\s*w/i)) && tmp[1] || 0;
        var days = (tmp = str.match(/((\d*\.)?\d+)\s*d/i)) && tmp[1] || 0;
        var hours = (tmp = str.match(/((\d*\.)?\d+)\s*h/i)) && tmp[1] || 0;
        var minutes = (tmp = str.match(/((\d*\.)?\d+)\s*(m\s|m$|mi)/i)) && tmp[1] || 0;
        var seconds = (tmp = str.match(/((\d*\.)?\d+)\s*s/i)) && tmp[1] || 0;

        millis += Number.parseInt(seconds, 0) * millis_in_second;
        millis += Number.parseInt(minutes, 0) * millis_in_minute;
        millis += Number.parseInt(hours, 0) * millis_in_hour;
        millis += Number.parseInt(days, 0) * millis_in_day;
        millis += Number.parseInt(weeks, 0) * millis_in_week;
        millis += Number.parseInt(months, 0) * millis_in_month;
        millis += Number.parseInt(years, 0) * millis_in_year;
      } else {
        // str contains no non-number characters
        var num_days = Number.parseInt(str, 10);
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
      var _ref5 = opts || {};

      var units = _ref5.units;
      var delimiter = _ref5.delimiter;
      var round = _ref5.round;

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
      var out = humanizeMilliseconds(getMillisecondsFromString(val), opts || {});
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
      var _ref6 = opts || {};

      var units = _ref6.units;
      var delimiter = _ref6.delimiter;
      var round = _ref6.round;

      var sanitized_units = undefined;
      if (units) {
        sanitized_units = units.map(function (u) {
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
        }).filter(function (u) {
          return u;
        });

        !sanitized_units.length && (sanitized_units = null);
      }

      function sanitize(val) {
        var opts = {};
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
      Object.assign(target, { sanitize: sanitize });

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
      var _ref7 = opts || { format: 'HH:mm A' };

      var format = _ref7.format;

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
      Object.assign(target, { sanitize: sanitize });

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

    setupExtender('watch_for_pending_changes', function (target) {
      setupObservableDisposables(target);
      if ('push' in target) {
        target.no_changes_pending = knockout.computed(function () {
          return target().every(function (r) {
            return r.loading && r.loading() || r.no_changes_pending();
          });
        }).extend({ notify: 'always' });
      } else {
        target.no_changes_pending = knockout.computed(function () {
          var obj = target();
          if (obj && !obj.loading()) {
            return obj.no_changes_pending();
          }
          return true;
        }).extend({ notify: 'always' });
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

    setupExtender('noUnset', function (target, val) {
      target.noUnset = val;
      return target;
    });

    /**
     * Adds an `addNew` method to `target`.
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
     * @return {ko.observable} The extended target
    */

    setupExtender('pushable', function (target, opts) {
      var _ref8 = opts || {};

      var klass = _ref8.klass;
      var this_arg = _ref8.this_arg;

      var args = opts.args || [];
      if (!klass) {
        throw new Error('Cannot define addNew method without knowing the class to instanciate');
      }
      if (!this_arg) {
        throw new Error('Cannot define addNew method without knowing first parameter to instanciate klass with');
      }
      if ('push' in target) {
        target.addNew = function addNew() {
          return new Promise(function (resolve) {
            var record = new (Function.prototype.bind.apply(klass, [null].concat([this_arg], babelHelpers_toConsumableArray(args.map(function (arg) {
              return typeof arg === 'function' ? arg.call(this_arg) : arg;
            })))))();
            if ('doneLoading' in record) {
              record.doneLoading().then(function () {
                target.push(record);
                resolve();
              });
            } else {
              target.push(record);
              resolve();
            }
          });
        };
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

    setupExtender('nestable', function (target, resource_name) {
      target.resource_name = resource_name;
      target.nestable_name = resource_name + '_attributes';
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

    setupExtender('track_focus', function (target, opts) {
      var _ref9 = opts || {};

      var track_has_had = _ref9.track_has_had;

      target.has_focus = knockout.observable(false);
      if (track_has_had) {
        (function () {
          target.has_had_focus = knockout.observable(false);
          var s = target.has_focus.subscribe(function (has_focus) {
            if (!has_focus) {
              // just blurred out of input
              target.has_had_focus(true);
              s.dispose();
            }
          });
          target.disposables.push(s);
        })();
      }
      return target;
    });

    // The includes() method determines whether an array includes a certain element,
    // returning true or false as appropriate.
    //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
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

    var extenders_assigned = false;

    var KnockoutJsonApiUtils = function () {
      function KnockoutJsonApiUtils() {
        babelHelpers_classCallCheck(this, KnockoutJsonApiUtils);
      }

      babelHelpers_createClass(KnockoutJsonApiUtils, null, [{
        key: 'setupExtenders',
        value: function setupExtenders() {
          if (!extenders_assigned) {
            Object.assign(ko.extenders, extenders);
            extenders_assigned = true;
          }
        }
      }, {
        key: 'utils',
        get: function get() {
          return json_api_utils;
        }
      }, {
        key: 'KOFormBase',
        get: function get() {
          return KOFormBase;
        }
      }, {
        key: 'Fraction',
        get: function get() {
          return fraction;
        }
      }, {
        key: 'humanizeDuration',
        get: function get() {
          return humanizeDuration;
        }
      }]);
      return KnockoutJsonApiUtils;
    }();

    return KnockoutJsonApiUtils;

}));