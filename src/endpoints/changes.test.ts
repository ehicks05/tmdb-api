import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('changes', { timeout: 10_000, concurrent: false }, async () => {
	const ids = await tmdb.changes('person', {
		start: new Date(new Date().setHours(new Date().getHours() - 6)),
		end: new Date(),
	});

	const oneChange = ids?.[0];

	expect(ids).toBeDefined();
	expect(oneChange).toBeTypeOf('number');
});
