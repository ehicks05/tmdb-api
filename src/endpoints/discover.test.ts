import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('discover', { timeout: 10_000, concurrent: false }, async () => {
	const ids = await tmdb.discoverMediaIds('movie', false);

	const oneItem = ids?.[0];

	expect(oneItem).toBeTypeOf('number');
});
