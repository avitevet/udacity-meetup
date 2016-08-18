(function() {
	var inviteList = new InviteList('#inviteList', InviteListMode.RO);

	['eventType', 'eventName', 'host', 'location', 'message'].forEach(function(id) {
		document.querySelector('#' + id).innerHTML = sessionStorage[id];
	});

	// format the dates

})();
