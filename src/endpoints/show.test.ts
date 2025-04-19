import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const id = 1396;

test('get show', async () => {
	const show = await tmdb.show({ id });

	expect(show).toBeDefined();
	expect(show).not.toHaveProperty('content_ratings');
	expect(show).not.toHaveProperty('credits');
	expect(show).not.toHaveProperty('images');
	expect(show).not.toHaveProperty('watch/providers');
});

test('get show with appends', async () => {
	const show = await tmdb.show({
		id,
		appends: {
			content_ratings: true,
			credits: true,
			images: true,
			'watch/providers': true,
		},
	});

	expect(show).toBeDefined();
	expect(show).toHaveProperty('content_ratings');
	expect(show).toHaveProperty('credits');
	expect(show).toHaveProperty('images');
	expect(show).toHaveProperty('watch/providers');
});
