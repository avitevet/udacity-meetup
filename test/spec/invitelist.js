/* global InviteList */

describe('InviteList', function() {

	beforeEach(function() {
		sessionStorage.clear();
	});

	function getInviteListFixture() {
		const InviteListFixtureStr = '<h4 class="text-center">Invitation list<i class="fa fa-times pull-right" id="times"></i><i class="fa fa-plus pull-right hidden" id="plus"></i></h4>\
	<ul class="list-group" id="entries">\
	<li class="list-group-item" id="noguests">No guests invited :(</li>\
	</ul>';

		var container = document.createElement('div');
		container.setAttribute('id', 'inviteList');
		container.innerHTML = InviteListFixtureStr;

		return container;
	}

	it('should add an entry', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entry = {email: 'avi@avi.com', text:'Avi'};

		inviteList.addEntry(entry);

		var entries = dom.querySelector('#entries');
		expect(entries.querySelector('#noguests').classList.contains('hidden')).toEqual(true);
		expect(sessionStorage.invitedEntries).toEqual(JSON.stringify([entry]));
	});

	it('should raise guest-added', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entry = {email: 'avi@avi.com', text:'Avi'};

		var eventRaised = false;
		document.addEventListener('guest-added', function() {
			eventRaised = true;
		});

		inviteList.addEntry(entry);

		expect(eventRaised).toEqual(true);
	});

	it('should raise guest-added on 2nd guest', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entries = [{email: 'avi@avi.com', text:'Avi'}, {email: 'avi2@avi.com', text:'Avi2'},];

		inviteList.addEntry(entries[0]);

		var eventRaised = false;
		document.addEventListener('guest-added', function() {
			eventRaised = true;
		});

		inviteList.addEntry(entries[1]);

		expect(eventRaised).toEqual(true);
	});

	it('should raise no-guests correctly', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entries = [{email: 'avi@avi.com', text:'Avi'}, {email: 'avi2@avi.com', text:'Avi2'},];

		var eventRaised = false;
		document.addEventListener('no-guests', function() {
			eventRaised = true;
		});

		entries.forEach(function(entry) {
			inviteList.addEntry(entry);
		});

		inviteList.removeEntry(dom.querySelector('#entries i'));
		expect(eventRaised).toEqual(false);
		inviteList.removeEntry(dom.querySelector('#entries i'));
		expect(eventRaised).toEqual(true);
	});

	it('should add and remove an entry', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entry = {email: 'avi@avi.com', text:'Avi'};

		inviteList.addEntry(entry);
		inviteList.removeEntry(dom.querySelector('#entries i'));

		var entries = dom.querySelector('#entries');
		expect(entries.querySelector('#noguests').classList.contains('hidden')).toEqual(false);
		expect(entries.children.length).toEqual(1);
		expect(sessionStorage.invitedEntries).toEqual(JSON.stringify([]));
	});

	it('should add 2 and remove an entry', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entries = [{email: 'avi@avi.com', text:'Avi'}, {email: 'avi2@avi.com', text:'Avi2'}];

		entries.forEach(function(entry) {
			inviteList.addEntry(entry);
		});
		inviteList.removeEntry(dom.querySelector('#entries i'));

		var entriesDom = dom.querySelector('#entries');
		expect(entriesDom.querySelector('#noguests').classList.contains('hidden')).toEqual(true);
		expect(entriesDom.children.length).toEqual(2);
		expect(sessionStorage.invitedEntries).toEqual(JSON.stringify([entries[1]]));
	});

	it('should hide the list', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entries = dom.querySelector('#entries');
		var times = dom.querySelector('#times');
		var plus = dom.querySelector('#plus');

		expect(entries.classList.contains('hidden')).toEqual(false);
		expect(times.classList.contains('hidden')).toEqual(false);
		expect(plus.classList.contains('hidden')).toEqual(true);

		dom.querySelector('#times').click();

		expect(entries.classList.contains('hidden')).toEqual(true);
		expect(times.classList.contains('hidden')).toEqual(true);
		expect(plus.classList.contains('hidden')).toEqual(false);
	});

	it('should show the list', function() {
		var dom = getInviteListFixture();
		var inviteList = new InviteList(dom);
		var entries = dom.querySelector('#entries');
		var times = dom.querySelector('#times');
		var plus = dom.querySelector('#plus');

		expect(entries.classList.contains('hidden')).toEqual(false);
		expect(times.classList.contains('hidden')).toEqual(false);
		expect(plus.classList.contains('hidden')).toEqual(true);

		dom.querySelector('#times').click();
		dom.querySelector('#plus').click();

		expect(entries.classList.contains('hidden')).toEqual(false);
		expect(times.classList.contains('hidden')).toEqual(false);
		expect(plus.classList.contains('hidden')).toEqual(true);
	});
});
