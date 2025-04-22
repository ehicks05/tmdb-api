import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const id = 89;
const date = '1989-05-24';

test('discover', { timeout: 10_000, concurrent: false }, async () => {
	const results = await tmdb.discover({
		media: 'movie',
		query: {
			'primary_release_date.gte': date,
			'primary_release_date.lte': date,
		},
	});

	const indianaJones = results.find((o) => o.id === id);

	expect(indianaJones).toBeDefined();
});

test('discover exhaustive', { timeout: 10_000, concurrent: false }, async () => {
	const results = await tmdb.discover({
		media: 'movie',
		query: {
			'primary_release_date.gte': date,
			'primary_release_date.lte': date,
		},
		exhaustive: true,
	});

	const indianaJones = results.find((o) => o.id === id);

	expect(indianaJones).toBeDefined();
});
