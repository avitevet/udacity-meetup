function initAutocomplete() {
	var input = document.getElementById('location');
	var showOnMap = document.getElementById('showmap');
	var autocomplete = new google.maps.places.Autocomplete(input, {});


	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (place.formatted_address) {
			showOnMap.className = '';
			showOnMap.firstChild.href = place.url;
		}
		else {
			showOnMap.classname = 'invisible';
		}
	});
}

function laterThanNow(elem) {
	var date = moment(elem.value);
	var now = moment();

	var msg = date.isBefore(now) ? 'The date & time you choose must be in the future' : '';
	elem.setCustomValidity(msg);

	return msg === '';
}

function startBeforeEnd(startElem, endElem) {
	var start = moment(startElem.value);
	var end = moment(endElem.value);

	var msg = !start.isBefore(end) ? 'The end date must be later than the start date' : '';
	endElem.setCustomValidity(msg);

	return msg === '';
}


(function() {
	var host = document.getElementById('host');
	host.value = typeof(sessionStorage.username) === 'undefined' ? '' : sessionStorage.username;

	// custom validation of the start & end dates
	var startDateInput = document.getElementById('startDateTime');
	var endDateInput = document.getElementById('endDateTime');

	startDateInput.addEventListener('blur', function() {
		if (laterThanNow(startDateInput) && (endDateInput.value === '')) {
			endDateInput.value = moment(startDateInput.value).add(8, 'hours').format('YYYY-MM-DDTHH:mm');
		}
	});

	endDateInput.addEventListener('blur', function(e) {
		startBeforeEnd(startDateInput, e.srcElement);
	});

	var form = document.querySelector('form');
	var allInputs = form.querySelectorAll('input');
	var progressbarDescribe = document.querySelector('.progressbar > li:first-child i');

	allInputs.forEach(function(input) {
		input.addEventListener('blur', function() {
			progressbarDescribe.className = allValid(form) ? 'fa fa-check-circle-o progress-complete' : 'fa fa-times-circle-o progress-incomplete';
		});
	});

	// add all form data to localstorage after the form is submitted
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		allInputs.forEach(function(item) {
			sessionStorage[item.id] = item.value;
		});
		window.location.assign(form.action);
	});

})();
