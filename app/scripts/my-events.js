/* global moment */

var MyEvents = function(root) {
	if (typeof(root) === 'string') {
		root = document.querySelector(root);
	}

	root.querySelector('#eventName').innerHTML = sessionStorage.eventName;
	root.querySelector('#numNoResponse').innerHTML = JSON.parse(sessionStorage.invitedEntries).length;
	root.querySelector('#eventStartDate').innerHTML = moment(sessionStorage.startDateTime).calendar();
};

(function() {
	var root = document.querySelector('#myevents');
	if (root) {
		new MyEvents(root);
	}
})();
