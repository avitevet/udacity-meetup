/**
 * base class for a form containing real-time (onblur or earlier) validation.
 * What this does for all input elements with class "rtvalidation":
 *   Use JS to create a message field after the input field
 *   Add an event handler to the element's oninput event that shows the validationMessage
 *     in the message field for that element
 */
var ValidatedForm = function(root) {
	var all, messageField;

	this.rootEl = typeof(root) === 'string' ? document.querySelector(root) : root;

	all = this.rootEl.querySelectorAll('.rtvalidation');
	for (var i = 0; i < all.length; ++i) {
		messageField = document.createElement('div');
		messageField.className = 'validationMsg';
		// insert the message field after the input field
		all[i].parentNode.insertBefore(messageField, all[i].nextSibling);

		// turn off bubble validationMessage
		all[i].addEventListener('invalid', function(e) {
			e.preventDefault();
			e.srcElement.nextSibling.innerText = e.srcElement.validationMessage;
		});

		// put the validation message in the message field
		all[i].addEventListener('input', function(e) {
			e.srcElement.nextSibling.innerText = e.srcElement.validationMessage;
		});
	}
};

/**
	* Return true if all the input elements in the given form DOM object
	* are valid, otherwise false.
	*/
ValidatedForm.prototype.allValid = function(formElement) {
	var valid = true;

	formElement.querySelectorAll('input').forEach(function(item) {
		valid &= item.checkValidity();
	});

	return valid;
};
