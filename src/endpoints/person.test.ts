import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const id = 6384;

test('get person', async () => {
	const person = await tmdb.person({ id });

	expect(person).toBeDefined();
	expect(person).not.toHaveProperty('images');
	expect(person).not.toHaveProperty('movie_credits');
	expect(person).not.toHaveProperty('tv_credits');
});

test('get person with appends', async () => {
	const person = await tmdb.person({
		id,
		appends: {
			images: true,
			movie_credits: true,
			tv_credits: true,
		},
	});

	expect(person).toBeDefined();
	expect(person).toHaveProperty('images');
	expect(person).toHaveProperty('movie_credits');
	expect(person).toHaveProperty('tv_credits');
});
