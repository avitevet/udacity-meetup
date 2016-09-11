/* global moment, google, ValidatedForm */

var CreateEventForm = function(root) {
	var me = this;

	ValidatedForm.call(this, root);

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
		if (me.startDateInputEl.value && me.startLaterThanNow() && (me.endDateInputEl.value === '')) {
			me.endDateInputEl.value = moment(me.startDateInputEl.value).add(8, 'hours').format('YYYY-MM-DDTHH:mm');
		}
	});
	// when the user leaves the end date field, check that the start date/time
	// is before the end date/time
	this.endDateInputEl.addEventListener('blur', function() {
		me.startBeforeEnd();
	});

	// update the progress bar when all the inputs are valid.  Check every
	// time a field is blurred, and when the form is instantiated
	this.allInputEls.forEach(function(input) {
		input.addEventListener('blur', function() {
			me.updateFormValid();
		});
		input.value = sessionStorage[input.id] || '';
	});
	this.updateFormValid();

	// provide a default for the host
	this.hostEl.value = this.hostEl.value || (typeof(sessionStorage.username) === 'undefined' ? '' : sessionStorage.username);

	// add all form data to localstorage after the form is submitted
	this.formEl.addEventListener('submit', function(e) {
		e.preventDefault();
		me.allInputEls.forEach(function(item) {
			sessionStorage[item.id] = item.value;
		});
		window.location.assign(me.formEl.action);
	});

	this.initAddressAutocomplete();
};

CreateEventForm.prototype = Object.create(CreateEventForm.prototype);
CreateEventForm.prototype.constructor = CreateEventForm;

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
	this.progressbarDescribeEl.className = this.allValid(this.formEl) ? 'fa fa-check-circle-o progress-complete' : 'fa fa-times-circle-o progress-incomplete';
};

CreateEventForm.prototype.initAddressAutocomplete = function() {
	var me = this,
		autocomplete = new google.maps.places.Autocomplete(this.locationEl, {});

	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (place.formatted_address) {
			me.showOnMapEl.classList.remove('invisible');
			me.showOnMapEl.firstChild.href = place.url;
		}
		else {
			me.showOnMapEl.classList.add('invisible');
		}
	});
};

(function() {
	var createEventForm = document.querySelector('.create-event');
	if (createEventForm) {
		new CreateEventForm(createEventForm);
	}
})();
