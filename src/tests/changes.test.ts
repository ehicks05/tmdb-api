import { expect, test } from 'vitest';
import { tmdb } from './client.js';

test('changes', { timeout: 10_000, concurrent: false }, async () => {
	const ids = await tmdb.getRecentlyChangedIds('person', {
		start: new Date(new Date().setHours(new Date().getHours() - 6)),
		end: new Date(),
	});

	const oneChange = ids?.[0];

	expect(oneChange).toBeTypeOf('number');
});
