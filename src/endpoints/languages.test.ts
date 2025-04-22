import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('get languages', async () => {
	const languages = await tmdb.languages();
	const english = languages.find((o) => o.iso_639_1 === 'en');

	expect(languages).toBeDefined();
	expect(languages).length.greaterThanOrEqual(100);
	expect(english).toBeDefined();
});
