window.Validator = window.Validator || {};
window.Validator.debug = false;
(validator => {
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
      this.listen(form,"invalid", this.checkField, true);
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
      let isRequired = true;
      let pattern;
      let elName = $(el).attr('name');
      let invalidMsg = $(el).data('invalidMsg');
      let err;
      let requiredMsg = 'This is a required field';
      el.setCustomValidity('');
      if (el.validity) {
        if (el.validity.valueMissing) {
          el.setCustomValidity(' ');
          logInfo('${ elName } has a missing value and it is required');
          return err = new validator.Err(el.id, requiredMsg);
        }
        if (!el.validity.valid) {
          el.setCustomValidity(' ');
          logInfo(`${ elName } is an invalid field`);
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
      let errors = [];

      let inputFields = Array.prototype.map.call(fields, f => f);
      for(let [index, field] of inputFields.enteries()) {
        var error = validator.checkField(field);
        if (error) {
          errors.push(error);
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
        return node.attachEvent(`on${ type }`, fn);
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
      let t = typeof obj[methd];
      let reFeaturedMethod = new RegExp('^function|object$', 'i');
      return !!(reFeaturedMethod.test(t) && obj[methd] || t === 'unknown');
    };

    /**
    * function that will 
    *
    * @param
    *
    * @return
    */
    class Err {
      constructor(formField, errorMsg) {
        this.formField = formField;
        this.errorMsg = errorMsg;
      }
      toString() {
        return 'error field --> ${ this.formField.toString() }, errorMsg --> ${ this.errorMsg.toString() }';
      }
    };

    validator.Err = Err;

    /**
    * function that will 
    *
    * @param
    *
    * @return
    */
    let logInfo = function (msg) {
      if (validator.debug) {
        return console.info(msg);
      }
    };
})(window.Validator);