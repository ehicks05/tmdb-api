import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('get movie certifications', async () => {
	const certifications = await tmdb.certifications('movie');
	const us = certifications.certifications.US;
	const pg = us.find((o) => o.certification === 'PG');

	expect(us).toBeDefined();
	expect(us).length.greaterThanOrEqual(5);
	expect(pg).toBeDefined();
});

test('get tv certifications', async () => {
	const certifications = await tmdb.certifications('tv');
	const us = certifications.certifications.US;
	const tvPg = us.find((o) => o.certification === 'TV-PG');

	expect(us).toBeDefined();
	expect(us).length.greaterThanOrEqual(5);
	expect(tvPg).toBeDefined();
});
