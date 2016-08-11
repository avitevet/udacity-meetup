/**
	* Return true if all the input elements in the given form DOM object
	* are valid, otherwise false.
	*/
function allValid(formElement) {
	var valid = true;

	formElement.querySelectorAll('input').forEach(function(item) {
		valid &= item.checkValidity();
	});

	return valid;
}

/** store the login information in local storage, so it can be used by other
 * pages, then redirect to create-event.html
 */
function saveAuthentication(fullname, email) {
	// use the first name from the fullname as the username if available, otherwise take the
	// user part of the email address and use that as the username
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
}

(function() {
	var authenticationForm = document.getElementsByClassName('authentication');
	var fullname = document.getElementById('fullname');
	var email = document.getElementById('email');
	authenticationForm[0].addEventListener('submit', function(e) {
		e.preventDefault();
		var fullnameTxt = fullname ? fullname.value : undefined;
		saveAuthentication(fullnameTxt, email.value);
		window.location.assign('create-event.html');
	});
})();
