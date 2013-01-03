var validator = validator || {};

(function(d){
	
	validator.errors = [];
	
	validator.setup = function(form) {
		/* if you want to validate the field as the user tabs away from
		the field or when the form is submitted, you can use the
		below code */
		//validator.listen(form,"invalid",validator.checkField,true);
		//validator.listen(form,"blur",validator.checkField,true);
		//validator.listen(form,"input",validator.checkField,true);
	};
	validator.checkField = function (el) {
		var elName = $(el).attr('name');
		var invalidMsg = $(el).data('invalidMsg');
		var err;		
		var requiredMsg = "This is a required field";
		if(el.validity) {
			if(el.validity.valid) {
				console.log(elName + " is a valid field");
			}
			else if(el.validity.valueMissing) { // User hasn't typed anything
				el.setCustomValidity(' ');
				console.log(elName + " has a missing value");
				err = new validator.Err(el.id, requiredMsg);
			} else if (!el.validity.valid) {
				el.setCustomValidity(' ');
				err = new validator.Err(el.id, invalidMsg);
				console.log(elName + " is an invalid field");
			}
		} else {
			console.log("I do not have access to the validity object");
			var isRequired = $(el).attr('required') ? true : false;
			var pattern = new RegExp($(el).attr('pattern'));
			if(isRequired && el.value === '') {
				err = new validator.Err(el.id, requiredMsg);
			} else if (pattern) {
			  if(!pattern.test(el.value)) {
				err = new validator.Err(el.id, invalidMsg);
			  }
			}
		}
		if(err) {
			validator.errors.push(err);
		}
	};
	
	/* Util methods */
	validator.listen = function (node,type,fn,capture) {
		if(validator.isHostMethod(window,"addEventListener")) {
			/* FF & Other Browsers */
			node.addEventListener( type, fn, capture );
		} else if(validator.isHostMethod(window,"attachEvent") && typeof window.event !== "undefined") {
			/* Internet Explorer way */
			if(type === "blur") {
				type = "focusout";
			} else if(type === "focus") {
				type = "focusin";
			}
			node.attachEvent( "on" + type, fn );
		}
	};
	validator.preventActions = function (evt) {
		evt = evt || window.event;
		
		if(evt.stopPropagation && evt.preventDefault) {
			evt.stopPropagation();
			evt.preventDefault();
		} else {
			evt.cancelBubble = true;
			evt.returnValue = false;
		}
	};
	validator.getTarget = function (evt) {
		evt = evt || window.event;
	    return evt.target || evt.srcElement;
	};
	validator.isHostMethod = function(o, m) {
		var t = typeof o[m], reFeaturedMethod = new RegExp('^function|object$', 'i');
		return !!((reFeaturedMethod.test(t) && o[m]) || t == 'unknown');
	};
	
	/*Err Class*/
	validator.Err = function (formField, errorMsg)
	{
		this.formField = formField;
		this.errorMsg = errorMsg;
	};

	validator.Err.prototype.toString = function()
	{
		return(this.formField.toString() + ", errorMsg: " + this.errorMsg);
	};

})(document);


/*
Further reading:

http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-validitystate-valuemissing

http://www.alistapart.com/articles/forward-thinking-form-validation/

*/