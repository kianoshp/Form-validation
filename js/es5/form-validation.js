'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

window.Validator = window.Validator || {};
window.Validator.debug = false;
(function (validator) {
  validator.debug = validator.debug || false;
  /**
  * function that will 
  *
  * @param
  *
  * @return
  */
  validator.setup = function (form) {
    // if you want to validate the field as the user tabs away from
    // the field or when the form is submitted, you can use the
    // examples below:
    this.listen(form, 'invalid', this.checkField, true);
    // this.listen(form,"blur", this.checkField, true);
    // this.listen(form,"input", this.checkField, true);  
  };

  /**
  * function that will 
  *
  * @param
  *
  * @return
  */
  validator.checkField = function (el) {
    var isRequired = true;
    var pattern = undefined;
    var elName = $(el).attr('name');
    var invalidMsg = $(el).data('invalidMsg');
    var err = undefined;
    var requiredMsg = 'This is a required field';
    el.setCustomValidity('');
    if (el.validity) {
      if (el.validity.valueMissing) {
        el.setCustomValidity(' ');
        logInfo('${ elName } has a missing value and it is required');
        return err = new validator.Err(el.id, requiredMsg);
      }
      if (!el.validity.valid) {
        el.setCustomValidity(' ');
        logInfo('' + elName + ' is an invalid field');
        return err = new validator.Err(el.id, invalidMsg);
      }
    } else {
      logInfo('I don\'t have access to the validity object');
      isRequired = $(el).attr('required');
      pattern = new RegExp($(el).attr('pattern'));
      if (isRequired && el.value === '') {
        return err = new validator.Err(el.id, requiredMsg);
      }
      if (pattern) {
        if (!pattern.test(el.value)) {
          return err = new validator.Err(el.id, invalidMsg);
        }
      }
    }
    return err;
  };

  /**
  * function that will 
  *
  * @param
  *
  * @return
  */
  validator.validateForm = function (fields) {
    var errors = [];

    var inputFields = Array.prototype.map.call(fields, function (f) {
      return f;
    });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = inputFields.enteries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2);

        var index = _step$value[0];
        var field = _step$value[1];

        var error = validator.checkField(field);
        if (error) {
          errors.push(error);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return errors;
  };

  /**
  * function that will 
  *
  * @param
  *
  * @return
  */
  validator.listen = function (node, type, fn, capture) {
    if (validator.isHostMethod(window, 'addEventListener')) {
      return node.addEventListener(type, fn, capture);
    }
    if (validator.isHostMethod(window, 'attachEvent')) {
      if (type === 'blur') {
        type = 'focusout';
      }
      if (type === 'focus') {
        type = 'focusin';
      }
      return node.attachEvent('on' + type, fn);
    }
  };

  /**
  * function that will 
  *
  * @param
  *
  * @return
  */
  validator.isHostMethod = function (obj, methd) {
    var t = typeof obj[methd];
    var reFeaturedMethod = new RegExp('^function|object$', 'i');
    return !!(reFeaturedMethod.test(t) && obj[methd] || t === 'unknown');
  };

  /**
  * function that will 
  *
  * @param
  *
  * @return
  */

  var Err = (function () {
    function Err(formField, errorMsg) {
      _classCallCheck(this, Err);

      this.formField = formField;
      this.errorMsg = errorMsg;
    }

    _createClass(Err, [{
      key: 'toString',
      value: function toString() {
        return 'error field --> ${ this.formField.toString() }, errorMsg --> ${ this.errorMsg.toString() }';
      }
    }]);

    return Err;
  })();

  ;

  validator.Err = Err;

  /**
  * function that will 
  *
  * @param
  *
  * @return
  */
  var logInfo = function logInfo(msg) {
    if (validator.debug) {
      return console.info(msg);
    }
  };
})(window.Validator);