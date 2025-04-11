import { expect, test } from 'vitest';
import { tmdb } from './client.js';

test('discover', { timeout: 10_000 }, async () => {
	const ids = await tmdb.discoverMediaIds('movie', false);

	const oneItem = ids?.[0];

	expect(oneItem).toBeTypeOf('number');
});
