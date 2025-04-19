import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const id = 89;
const date = new Date(1989, 4, 24);

test('discover', { timeout: 10_000, concurrent: false }, async () => {
	const results = await tmdb.discover({ media: 'movie', start: date, end: date });

	const indianaJones = results.find((o) => o.id === id);

	expect(indianaJones).toBeDefined();
});
