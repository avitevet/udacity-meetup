describe('invite-guests', function () {
	describe('email parsing', function() {
		it('should parse single email correctly', function () {
			var email = 'avi@avitevet.com';
			var results = processEmails(email);
			expect(results[0]).toEqual([{email: email, text: email}]);
			expect(results[1]).toEqual([]);
		});
		it('should parse single copied email correctly', function () {
			var email = 'blah <avi@avitevet.com>';
			var results = processEmails(email);
			expect(results[0]).toEqual([{email: 'avi@avitevet.com', text: 'blah'}]);
			expect(results[1]).toEqual([]);
		});
		it('should parse 2 emails correctly', function () {
			var separators = [',', ';', ' ', '\n'];
			var emails = ['avi@avitevet.com', 'person@example.org'];
			separators.forEach(function(sep) {
				['', ' '].forEach(function(ws) {
					var text = emails.join(sep + ws);
					var results = processEmails(text);
					var expected = [];
					emails.forEach(function(email) {
						expected.push({email: email, text: email});
					});
					expect(results[0]).toEqual(expected);
					expect(results[1]).toEqual([]);
				});
			});
		});
		it('should parse 2 copied emails correctly', function () {
			var separators = [',', ';', ' ', '\n'];
			var emails = ['blah <avi@avitevet.com>', 'blah2 <person@example.org>'];
			separators.forEach(function(sep) {
				['', ' '].forEach(function(ws) {
					var text = emails.join(sep + ws);
					var results = processEmails(text);
					var expected = [];
					emails.forEach(function(email) {
						var tokens = email.split(/ \<|\>/);
						expected.push({email: tokens[1], text: tokens[0]});
					});
					expect(results[0]).toEqual(expected);
					expect(results[1]).toEqual([]);
				});
			});
		});

		it('should parse mixed emails correctly', function() {
			var text = 'blah <avi@avi.com> avi@avi2.com';
			var results = processEmails(text);
			expect(results[0]).toEqual([{email: 'avi@avi.com', text: 'blah'}, {email: 'avi@avi2.com', text: 'avi@avi2.com'}]);
			expect(results[1]).toEqual([]);
		});

		it('should parse mixed emails correctly 2', function() {
			var text = 'avi@avi2.com blah <avi@avi.com> ';
			var results = processEmails(text);
			expect(results[0]).toEqual([{email: 'avi@avi2.com', text: 'avi@avi2.com'}, {email: 'avi@avi.com', text: 'blah'}]);
			expect(results[1]).toEqual([]);
		});

		it('should parse mixed emails correctly with invalid addresses', function() {
			var text = 'bad avi@avi2.com blah <avi@avi.com> morebad';
			var results = processEmails(text);
			expect(results[0]).toEqual([{email: 'avi@avi2.com', text: 'avi@avi2.com'}, {email: 'avi@avi.com', text: 'blah'}]);
			expect(results[1]).toEqual(['bad', 'morebad']);
		});

		it('should detect invalid email correctly', function () {
			var email = 'avi';
			var results = processEmails(email);
			expect(results[0]).toEqual([]);
			expect(results[1]).toEqual([email]);
		});
		it('should detect 2 invalid emails correctly', function () {
			var email = 'avi@ stuff.com';
			var results = processEmails(email);
			expect(results[0]).toEqual([]);
			expect(results[1]).toEqual(['avi@', 'stuff.com']);
		});
		it('should handle empty strings gracefully 1', function () {
			var email = ',,,';
			var results = processEmails(email);
			expect(results[0]).toEqual([]);
			expect(results[1]).toEqual([]);
		});



	});
});
