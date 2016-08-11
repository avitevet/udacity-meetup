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
