import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('get providers', async () => {
	const providers = await tmdb.providers();
	const netflix = providers?.find((o) => o.provider_id === 8);

	expect(providers).toBeDefined();
	expect(providers).length.greaterThanOrEqual(100);
	expect(netflix).toBeDefined();
});
