(function() {
	document.querySelector('#eventName').innerHTML = sessionStorage.eventName;
	document.querySelector('#numNoResponse').innerHTML = JSON.parse(sessionStorage.invitedEntries).length;
	document.querySelector('#eventStartDate').innerHTML = moment(sessionStorage.startDateTime).calendar();
})();
