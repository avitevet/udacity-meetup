describe('InviteList', function() {


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

		inviteList.addEntry({email: 'avi@avi.com', text:'Avi'});

		var entries = dom.querySelector('#entries');
		expect(entries.querySelector('#noguests').classList.toString().split(/\s+/)).toContain('hidden');

	});

});
