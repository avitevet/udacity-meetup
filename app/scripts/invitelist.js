// pass the root element of the invite list.  The invite list includes the
// heading and the list, so pass the element that contains all those elements.

const InviteListMode = {
	RW: 0,
	RO: 1
};

var InviteList = function(selector, mode) {
	if (mode === undefined) {
		mode = InviteListMode.RW;
	}

	var self = this;
	this.rootEl = typeof(selector) === 'string' ? document.querySelector(selector) : selector;
	this.mode = mode;
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
InviteList.prototype.addEntry = function(entry, initial) {
	if (initial === undefined) {
		initial = false;
	}
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
	if (this.mode === InviteListMode.RW) {
		li.appendChild(icon);
	}

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
		return e.email !== email;
	});
	sessionStorage.invitedEntries = JSON.stringify(this.entries);
	grandparent.removeChild(parent);

	if (this.entries.length === 0) {
		this.noguests.classList.remove('hidden');
		document.dispatchEvent(this.noGuestsEvt);
	}
};
