import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const showId = 1396;
const seasonNumber = 1;

test('get show', async () => {
	const season = await tmdb.season({ showId, seasonNumber });

	expect(season).not.toBeNull();
	expect(season).not.toHaveProperty('credits');
	expect(season).not.toHaveProperty('images');
	expect(season).not.toHaveProperty('watch/providers');
});

test('get show with appends', async () => {
	const season = await tmdb.season({
		showId,
		seasonNumber,
		appends: {
			credits: true,
			images: true,
			'watch/providers': true,
		},
	});

	expect(season).not.toBeNull();
	expect(season).toHaveProperty('credits');
	expect(season).toHaveProperty('images');
	expect(season).toHaveProperty('watch/providers');
});
