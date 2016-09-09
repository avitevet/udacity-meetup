/* global InviteList, InviteListMode, moment */

var PreviewSend = function(root) {
	var me = this;
	this.rootEl = typeof(root) === 'string' ? document.querySelector(root) : root;
	this.inviteList = new InviteList('#inviteList', InviteListMode.RO);

	['eventType', 'eventName', 'host', 'location'].forEach(function(id) {
		me.rootEl.querySelector('#' + id).innerHTML = sessionStorage[id];
	});

	this.rootEl.querySelector('#message').innerHTML = sessionStorage['message'].replace(/\n/g, '<br>');

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
	this.rootEl.querySelector('#eventDates').innerHTML = startPart + ' - ' + endPart;

	this.rootEl.querySelector('#btnSend').addEventListener('click', function() {
		window.location.assign('my-events.html');
	});
};



(function() {
	var previewSendRoot = document.querySelector('#previewsend');
	if (previewSendRoot) {
		new PreviewSend(previewSendRoot);
	}
})();
