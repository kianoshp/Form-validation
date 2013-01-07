window.Validator ?= {}

((d, validator) ->
	validator.debug = true

	validator.setup = (form) ->
		###
		if you want to validate the field as the user tabs away from
		the field or when the form is submitted, you can use the
		examples below:
		validator.listen(form,"invalid",validator.checkField,true);
		validator.listen(form,"blur",validator.checkField,true);
		validator.listen(form,"input",validator.checkField,true);
		###

	validator.checkField = (el) ->
		elName = $(el).attr 'name'
		invalidMsg = $(el).data 'invalidMsg'
		err = undefined
		requiredMsg = 'This is a required field'
		el.setCustomValidity ''

		if el.validity
			if el.validity.valueMissing
				el.setCustomValidity ' '
				logInfo elName + ' has a missing value and it is required'
				return err	= new validator.Err el.id, requiredMsg

			if not el.validity.valid
				el.setCustomValidity ' '
				logInfo elName + ' is an invalid field'
				return err = new validator.Err el.id, invalidMsg
		else
			logInfo 'I don\'t have access to the validity object'
			isRequired = $(el).attr 'required'
			pattern = new RegExp $(el).attr 'pattern'
			if isRequired && el.value == ''
				return err = new validator.Err el.id, requiredMsg

			if pattern
				if not pattern.test el.value
					return err = new validator.Err el.id, invalidMsg

		return err

	validator.validateForm = (fields) ->
		errors = []
		$(fields).each ->
			error = validator.checkField @
			if error
				errors.push error
				return

		return errors

	validator.listen = (node, type, fn, capture) ->
		if validator.isHostMethod window, 'addEventListener'
			return node.addEventListener type, fn, capture

		if validator.isHostMethod window, 'attachEvent'
			if type == 'blur'
				type = 'focusout'

			if type == 'focus'
				type = 'focusin'

			return node.attachEvent 'on' + type, fn

	validator.isHostMethod = (obj, methd) ->
		t = typeof obj[methd]
		reFeaturedMethod = new RegExp '^function|object$', 'i'
		!! ((reFeaturedMethod.test(t) && obj[methd]) || t == 'unknown')

	validator.Err = (formField, errorMsg) ->
		@formField = formField
		@errorMsg = errorMsg

	validator.Err.prototype.toString = ->
		'error field --> ' + @formField.toString() + ', errorMsg --> ' + @errorMsg.toString()

	logInfo = (msg) ->
		if validator.debug
			console.info msg
) document, window.Validator
