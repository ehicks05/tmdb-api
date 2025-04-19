import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const id = 603;

test('get movie', async () => {
	const movie = await tmdb.movie({ id });

	expect(movie).toBeDefined();
	expect(movie).not.toHaveProperty('credits');
	expect(movie).not.toHaveProperty('images');
	expect(movie).not.toHaveProperty('releases');
	expect(movie).not.toHaveProperty('watch/providers');
});

test('get movie with appends', async () => {
	const movie = await tmdb.movie({
		id,
		appends: {
			credits: true,
			images: true,
			releases: true,
			'watch/providers': true,
		},
	});

	expect(movie).toBeDefined();
	expect(movie).toHaveProperty('credits');
	expect(movie).toHaveProperty('images');
	expect(movie).toHaveProperty('releases');
	expect(movie).toHaveProperty('watch/providers');
});
