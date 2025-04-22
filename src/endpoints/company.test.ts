import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('get company', async () => {
	const lucasFilm = await tmdb.company(1);

	expect(lucasFilm).toBeDefined();
});

test('get less known company', async () => {
	const caraïbes = await tmdb.company(1000);

	expect(caraïbes).toBeDefined();
});
