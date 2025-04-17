import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

test('genres', async () => {
	const genres = await tmdb.getGenres();

	const comedy = genres?.find((o) => o.id === 35);
	const adventure = genres?.find((o) => o.id === 12);
	const reality = genres?.find((o) => o.id === 10764);

	expect(adventure).toHaveProperty('type', 'MOVIE');
	expect(reality).toHaveProperty('type', 'SHOW');
	expect(comedy).toHaveProperty('type', 'BOTH');
});
