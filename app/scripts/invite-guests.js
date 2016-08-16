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

// pass the root element of the invite list.  The invite list includes the
// heading and the list, so pass the element that contains all those elements.
var InviteList = function(selector) {
	var self = this;
	this.rootEl = document.querySelector(selector);
	this.listRootEl = this.rootEl.querySelector('#entries');
	this.timesIcon = this.rootEl.querySelector('#times');
	this.plusIcon = this.rootEl.querySelector('#plus');
	this.noguests = this.rootEl.querySelector('#noguests');
	this.guestAddedEvt = new Event('guest-added');
	this.noGuestsEvt = new Event('no-guests');
	this.entries = 	sessionStorage.invitedEntries ? JSON.parse(sessionStorage.invitedEntries) : [];
	this.entries.forEach(function(entry) {
		self.addEntry(entry, true);
	});

	this.timesIcon.addEventListener('click', function() {
		self.hide();
	});

	this.plusIcon.addEventListener('click', function() {
		self.show();
	});
};

// show the list, including the "no guests" message if this.entries is empty.
// also, change the icon to fa-times instead of fa-plus
InviteList.prototype.show = function() {
	this.listRootEl.className = 'list-group';
	this.timesIcon.classList.remove('hidden');
	this.plusIcon.classList.add('hidden');
	var noguestsFunc = (this.entries.length === 0) ? this.noguests.classList.remove : this.noguests.classList.add;
	noguestsFunc.call(this.noguests.classList, 'hidden');
};

// hide the list.
// also, change the icon to fa-times instead of fa-plus
InviteList.prototype.hide = function() {
	this.listRootEl.classList.add('hidden');
	this.timesIcon.classList.add('hidden');
	this.plusIcon.classList.remove('hidden');
};

/**
 	* Adds the given entry to the list.  Entry should be an object with email and
	* text properties.
	*
	* @return true if the element was added, false otherwise.  Can return false
	*         when the email already exists in the list, even if the label/text doesn't.
	*/
InviteList.prototype.addEntry = function(entry, initial = false) {
	// if the entry is already in the list, don't add it
	var contains = this.entries.some(function(e) {
		return (e.email === entry.email);
	});
	if (contains && !initial) {
		return false;
	}
	if (!initial) {
		this.entries.push(entry);
		sessionStorage.invitedEntries = JSON.stringify(this.entries);
	}

	// create the new node, then add it to the inviteList
	var self = this;
	var nodeTxt = document.createTextNode(entry.text + ' ');
	var icon = document.createElement('i');
	icon.className = 'fa fa-user-times';
	icon.addEventListener('click', function(e) {
		self.removeEntry(e.srcElement);
	});

	var li = document.createElement('li');
	li.setAttribute('data-email', entry.email);
	li.className = 'list-group-item';
	li.appendChild(nodeTxt);
	li.appendChild(icon);

	this.listRootEl.appendChild(li);

	// hide the noguests message and raise the guestAddedEvent
	this.noguests.classList.add('hidden');
	document.dispatchEvent(this.guestAddedEvt);

	return true;
};

/**
 * @param clickedIcon  The Element that was clicked.  The email associated with
 *                     the icon will be deleted
 */
InviteList.prototype.removeEntry = function(clickedIcon) {
	var parent = clickedIcon.parentElement;
	var grandparent = parent.parentElement;

	var email = parent.getAttribute('data-email');
	this.entries = this.entries.filter(function(e) {
		e.email !== email;
	});
	sessionStorage.invitedEntries = JSON.stringify(this.entries);
	grandparent.removeChild(parent);

	if (this.entries.length === 0) {
		this.noguests.classList.remove('hidden');
		document.dispatchEvent(this.noGuestsEvt);
	}
};

(function() {

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

	// change red x to green circle in progressbar when at least 1 person has been added
	var progressbarInvite = document.querySelector('.progressbar > li:nth-child(2) i');
	document.addEventListener('guest-added', function() {
		progressbarInvite.className = 'fa fa-check-circle-o progress-complete';
	});
	document.addEventListener('no-guests', function() {
		progressbarInvite.className = 'fa fa-times-circle-o progress-incomplete';
	});
})();
