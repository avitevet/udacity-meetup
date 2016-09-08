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
