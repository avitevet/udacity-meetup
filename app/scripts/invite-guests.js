var inviteList = document.querySelector('#inviteList');

function addToInviteList(entry) {
	// create the new node, then add it to the inviteList
	var nodeTxt = document.createTextNode(entry.text + ' ');
	var icon = document.createElement('i');
	icon.className = 'fa fa-user-times';

	var li = document.createElement('li');
	li.setAttribute('data-email', entry.email);
	li.className = 'list-group-item';
	li.appendChild(nodeTxt);
	li.appendChild(icon);

	inviteList.appendChild(li);
}

function isEmail(text) {
	// from emailregex.com
	return text.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
}

function processEmails(txt) {
	// technically this is incorrect, because emails are allowed to have
	// commas, semicolons, and spaces in them if they are quoted.  But, I am taking a risk
	// and assuming that those types of email addresses are rare.

	// split the text into what I think are emails, or maybe copies of emails from an email message header
	var tokens = txt.split(/[,; \t\n]+/);
	var invalid = [];
	var emails = [];

	// scan the tokens.  If the token is an email in brackets, then use everything
	// from the last email in brackets as the text.  If the token is an email,
	// then use the email as is and all the prior text is invalid stuff.  If we reach
	// the end, and there is stuff in the buffer, it's all invalid.

	var lastEmailIndex = 0;
	var i = 0;
	for (i = 0; i < tokens.length; i++) {
		var token = tokens[i].trim();
		// take off any leading/trailing angle brackets
		var nonBracketToken = token.replace(/^\<|\>$/g, '');

		if (isEmail(token)) {
			// addToInviteList({email: token, text: token});
			emails.push({email: token, text: token});
			if (lastEmailIndex !== i) {
				Array.prototype.push.apply(invalid, tokens.slice(lastEmailIndex, i));
			}

			lastEmailIndex = i + 1;
		}
		else if (isEmail(nonBracketToken)) {
			var text = tokens.slice(lastEmailIndex, i).join(' ');
//			addToInviteList({email: nonBracketToken, text: text});
			emails.push({email: nonBracketToken, text: text});
			lastEmailIndex = i + 1;
		}
	}

	// invalid tokens at end of the string
	if (lastEmailIndex != i) {
		Array.prototype.push.apply(invalid, tokens.slice(lastEmailIndex, i));
	}

	// post-process invalid to remove empty strings
	var invalidNonEmpty = invalid.filter(function(item) {
		return item !== '';
	});

	return [emails, invalidNonEmpty];
}

(function() {
	// change red x to green circle in progressbar when at least 1 person has been added
	var progressbarInvite = document.querySelector('.progressbar > li:nth-child(2) i');

	var inviteTxt = document.querySelector('textarea');

	var inviteGuestsBtn = document.querySelector('.btn-invite-guests');
	inviteGuestsBtn.addEventListener('click', function() {
		var results = processEmails(inviteTxt.value);
		results[0].forEach(function(entry) {
			addToInviteList(entry);
		});
		inviteTxt.value = results[1].join(', ');
	});



//			progressbarInvite.className = allValid(form) ? 'fa fa-check-circle-o progress-complete' : 'fa fa-times-circle-o progress-incomplete';

})();
