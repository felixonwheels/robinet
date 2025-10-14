it('e2e', function () {
	cy.visit(' http://localhost:4173/');

	cy.intercept('POST', 'https://overpass-api.de/api/interpreter', { fixture: 'overpass_api.json' });

	cy.get('input[type=file]').selectFile(
		'cypress/fixtures/Draguignan_Vidauban_Sainte_Maxime_Fréjus.gpx',
		{ force: true }
	);

	cy.get('input.flex').click();

	cy.get('input.flex').type('{selectAll}wateeeeeer');

	cy.get('button.h-10').click();

	cy.readFile('cypress/downloads/wateeeeeer.gpx').then((xmlText) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(xmlText, 'application/xml');
		const wpts = doc.querySelectorAll('wpt');
		const count = wpts.length;

		cy.log(`Found ${count} waypoints`);

		expect(count).to.eq(10);
	});
});
