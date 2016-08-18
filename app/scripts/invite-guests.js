(function() {
	// change red x to green circle in progressbar when at least 1 person has been added
	var progressbarInvite = document.querySelector('.progressbar > li:nth-child(2) i');
	document.addEventListener('guest-added', function() {
		progressbarInvite.className = 'fa fa-check-circle-o progress-complete';
	});
	document.addEventListener('no-guests', function() {
		progressbarInvite.className = 'fa fa-times-circle-o progress-incomplete';
	});

	var inviteTxt = document.querySelector('textarea');
	var inviteList = new InviteList('#inviteList');

	var inviteGuestsBtn = document.querySelector('.btn-invite-guests');
	inviteGuestsBtn.addEventListener('click', function() {
		var results = processEmails(inviteTxt.value);
		results[0].forEach(function(entry) {
			inviteList.addEntry(entry);
		});
		inviteTxt.value = results[1].join(', ');
		var invalidEmailsMsg = document.querySelector('#invalidEmails');
		if (results[1].length > 0) {
			invalidEmailsMsg.classList.remove('hidden');
		}
		else {
			invalidEmailsMsg.classList.add('hidden');
		}
	});

})();
