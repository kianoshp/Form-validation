window.Validator = window.Validator || {};

window.Validator.debug = true;

  (function(validator) {
    validator.debug = validator.debug || true;
    validator.setup = function(form) {
    /*
    if you want to validate the field as the user tabs away from
    the field or when the form is submitted, you can use the
    examples below:
    validator.listen(form,"invalid",validator.checkField,true);
    validator.listen(form,"blur",validator.checkField,true);
    validator.listen(form,"input",validator.checkField,true);
    */
    };
      
    validator.checkField = function(el) {
      var isRequired = true;
      var pattern;
      var elName = $(el).attr('name');
      var invalidMsg = $(el).data('invalidMsg');
      var err;
      var requiredMsg = 'This is a required field';

      el.setCustomValidity('');
      if (el.validity) {
        if (el.validity.valueMissing) {
          el.setCustomValidity(' ');
          logInfo(elName + ' has a missing value and it is required');
          return err = new validator.Err(el.id, requiredMsg);
        }

        if (!el.validity.valid) {
          el.setCustomValidity(' ');
          logInfo(elName + ' is an invalid field');
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

    validator.validateForm = function(fields) {
      var errors = [];

      $(fields).each(function() {
        var error = validator.checkField(this);
        if (error) {
          errors.push(error);
        }
      });

      return errors;
    };

    validator.listen = function(node, type, fn, capture) {
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

    validator.isHostMethod = function(obj, methd) {
      var t = typeof obj[methd];
      var reFeaturedMethod = new RegExp('^function|object$', 'i');

      return !!((reFeaturedMethod.test(t) && obj[methd]) || t === 'unknown');
    };

    validator.Err = function(formField, errorMsg) {
      this.formField = formField;
      this.errorMsg = errorMsg;
    };

    validator.Err.prototype.toString = function() {
      return 'error field --> ' + this.formField.toString() + ', errorMsg --> ' + this.errorMsg.toString();
    };

    var logInfo = function(msg) {
      if (validator.debug) {
        return console.info(msg);
      }
    };

  })(window.Validator);
