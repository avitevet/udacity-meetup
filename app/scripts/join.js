function reqLength(pw) {
	return pw.length > 14;
}

function reqLcChars(pw) {
	return pw.match(/[a-z]/);
}

function reqUcChars(pw) {
	return pw.match(/[A-Z]/);
}

function reqNumber(pw) {
	return pw.match(/[0-9]/);
}


(function() {
	// every time the text in the password box changes, check for the 4
	// conditions.  Set the custom validity of the password to empty (valid)
	// if all conditions pass, otherwise set the custom validity to invalid
	// if any fail.  Also, update the icon next to the condition based on the
	// pass/fail of the text

	var conditions = ['reqLength', 'reqLcChars', 'reqUcChars', 'reqNumber'];
	var passwordTxt = document.querySelector('#password');
	passwordTxt.addEventListener('input', function() {
		var pw = passwordTxt.value;
		var allValid = true;
		conditions.forEach(function(conditionName) {
			var conditionIcon = document.querySelector('#' + conditionName + ' > i');
			if (window[conditionName](pw)) {
				// change the icon to fa fa-check-circle-o progress-complete
				conditionIcon.className = 'fa fa-check-circle-o progress-complete';
			}
			else {
				// change the icon to fa fa-times-circle-o progress-incomplete, and
				// set the validation message to non-empty
				conditionIcon.className = 'fa fa-times-circle-o progress-incomplete';
				allValid = false;
			}
		});

		passwordTxt.setCustomValidity(allValid ? '' : 'Please choose a password that satisfies all the criteria');
	});
})();
