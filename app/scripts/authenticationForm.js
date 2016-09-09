/**
 * Creates an authentication form that, on submit, saves the login/signin information
 * for later use, and then redirects the user to the next page in the flow
 *
 * @param root  a Node that is the root of a form that has: an input with id =
 *  fullname and/or email, and a submit button
 */
var AuthenticationForm = function(root) {
	var me = this;

	this.fullnameEl = root.querySelector('#fullname');
	this.emailEl = root.querySelector('#email');
	this.passwordEl = root.querySelector('#password');

	// validate the password if the validation icons are present
	// every time the text in the password box changes, check for the 4
	// conditions.  Set the custom validity of the password to empty (valid)
	// if all conditions pass, otherwise set the custom validity to invalid
	// if any fail.  Also, update the icon next to the condition based on the
	// pass/fail of the text

	var conditions = ['reqLength', 'reqLcChars', 'reqUcChars', 'reqNumber'];
	this.passwordEl.addEventListener('input', function() {
		var pw = me.passwordEl.value;
		var allValid = true;
		conditions.forEach(function(conditionName) {
			var conditionIcon = root.querySelector('#' + conditionName + ' > i');
			if (conditionIcon) {
				if (me[conditionName](pw)) {
					// change the icon to fa fa-check-circle-o progress-complete
					conditionIcon.className = 'fa fa-check-circle-o progress-complete';
				}
				else {
					// change the icon to fa fa-times-circle-o progress-incomplete, and
					// set the validation message to non-empty
					conditionIcon.className = 'fa fa-times-circle-o progress-incomplete';
					allValid = false;
				}
			}
		});
		me.passwordEl.setCustomValidity(allValid ? '' : 'Please choose a password that satisfies all the criteria');
	});


	root.addEventListener('submit', function(e) {
		e.preventDefault();
		me.saveAuthentication();
		window.location.assign('create-event.html');
	});
};

/** store the login information in local storage, so it can be used by other
 * pages, then redirect to create-event.html
 */
AuthenticationForm.prototype.saveAuthentication = function() {
	// use the first name from the fullname as the username if available, otherwise take the
	// user part of the email address and use that as the username
	var fullname = this.fullnameEl ? this.fullnameEl.value : undefined;
	var email = this.emailEl.value;

	var delimiter, str;
	if (typeof(fullname) !== 'undefined') {
		delimiter = ' ';
		str = fullname;
	}
	else {
		delimiter = '@';
		str = email;
	}

	// username the string before the delimiter
	var delimPos = str.indexOf(delimiter);
	sessionStorage.username = (delimPos === -1) ? str : str.slice(0, delimPos);
};

AuthenticationForm.prototype.reqLength = function(pw) {
	return pw.length > 14;
};

AuthenticationForm.prototype.reqLcChars = function(pw) {
	return pw.match(/[a-z]/);
};

AuthenticationForm.prototype.reqUcChars = function(pw) {
	return pw.match(/[A-Z]/);
};

AuthenticationForm.prototype.reqNumber = function(pw) {
	return pw.match(/[0-9]/);
};


(function() {
	var authFormRoot = document.querySelector('.authentication');
	if (authFormRoot) {
		new AuthenticationForm(authFormRoot);
	}
})();
