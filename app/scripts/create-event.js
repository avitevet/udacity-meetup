/* global moment, allValid, google */

var CreateEventForm = function(root) {
	var self = this;

	this.formEl = root.tagName === 'FORM' ? root : root.querySelector('form');
	this.hostEl = this.formEl.querySelector('#host');
	this.startDateInputEl = this.formEl.querySelector('#startDateTime');
	this.endDateInputEl = this.formEl.querySelector('#endDateTime');
	this.locationEl = this.formEl.querySelector('#location');
	this.showOnMapEl = this.formEl.querySelector('#showmap');
	this.allInputEls = this.formEl.querySelectorAll('input, textarea');
	this.progressbarDescribeEl = document.querySelector('.progressbar > li:first-child i');

	// custom validation of the start & end dates - when the user leaves
	// the start date field, check that it's later than now, and
	// possibly provide a default for the end date
	this.startDateInputEl.addEventListener('blur', function() {
		if (self.startLaterThanNow() && (self.endDateInputEl.value === '')) {
			self.endDateInputEl.value = moment(self.startDateInputEl.value).add(8, 'hours').format('yyyy-MM-ddThh:mm');
		}
	});
	// when the user leaves the end date field, check that the start date/time
	// is before the end date/time
	this.endDateInputEl.addEventListener('blur', function() {
		self.startBeforeEnd();
	});

	// update the progress bar when all the inputs are valid.  Check every
	// time a field is blurred, and when the form is instantiated
	this.allInputEls.forEach(function(input) {
		input.addEventListener('blur', function() {
			self.updateFormValid();
		});
		input.value = sessionStorage[input.id] || '';
	});
	this.updateFormValid();

	// provide a default for the host
	this.hostEl.value = this.hostEl.value || (typeof(sessionStorage.username) === 'undefined' ? '' : sessionStorage.username);

	// add all form data to localstorage after the form is submitted
	this.formEl.addEventListener('submit', function(e) {
		e.preventDefault();
		self.allInputEls.forEach(function(item) {
			sessionStorage[item.id] = item.value;
		});
		window.location.assign(self.formEl.action);
	});

	this.initAddressAutocomplete();
};

CreateEventForm.prototype.startLaterThanNow = function() {
	var date = moment(this.startDateInputEl.value);
	var now = moment();

	var msg = date.isBefore(now) ? 'The date & time you choose must be in the future' : '';
	this.startDateInputEl.setCustomValidity(msg);

	return msg === '';
};

CreateEventForm.prototype.startBeforeEnd = function() {
	var start = moment(this.startDateInputEl.value);
	var end = moment(this.endDateInputEl.value);

	var msg = !start.isBefore(end) ? 'The end date must be later than the start date' : '';
	this.endDateInputEl.setCustomValidity(msg);

	return msg === '';
};

CreateEventForm.prototype.updateFormValid = function() {
	this.progressbarDescribeEl.className = allValid(this.formEl) ? 'fa fa-check-circle-o progress-complete' : 'fa fa-times-circle-o progress-incomplete';
};

CreateEventForm.prototype.initAddressAutocomplete = function() {
	var self = this,
		autocomplete = new google.maps.places.Autocomplete(this.locationEl, {});

	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (place.formatted_address) {
			self.showOnMapEl.classList.remove('invisible');
			self.showOnMapEl.firstChild.href = place.url;
		}
		else {
			self.showOnMapEl.classList.add('invisible');
		}
	});
};

(function() {
	var createEventForm = document.querySelector('.create-event');
	if (createEventForm) {
		new CreateEventForm(createEventForm);
	}
})();
