(function() {
	var inviteList = new InviteList('#inviteList', InviteListMode.RO);

	['eventType', 'eventName', 'host', 'location'].forEach(function(id) {
		document.querySelector('#' + id).innerHTML = sessionStorage[id];
	});

	document.querySelector('#message').innerHTML = sessionStorage['message'].replace(/\n/g, '<br>');

	// format the dates
	var startDateTime = moment(sessionStorage.startDateTime),
		endDateTime = moment(sessionStorage.endDateTime);

	// if they're on the same day, then use this format:
	// DayName, Month day year, startTime - endTime
	//
	// if they're on different days, then use this format:
	// DayName, Month day year, startTime - DayName, Month day year, endTime
	var startPart = startDateTime.format('dddd MMM D, YYYY, h:mmA');
	var endPart = endDateTime.format('h:mmA');
	if (!startDateTime.isSame(endDateTime, 'day')) {
		endPart = endDateTime.format('dddd MMM D, YYYY, h:mmA');
	}
	document.querySelector('#eventDates').innerHTML = startPart + ' - ' + endPart;

	document.querySelector('#btnSend').addEventListener('click', function() {
		window.location.assign('my-events.html');
	});
})();
