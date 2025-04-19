import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';
import {
	MovieSchema,
	PersonResponseSchema,
	SeasonResponseSchema,
	ShowSchema,
} from '../types/index.js';

test('get movie', async () => {
	const id = 89;
	const res = await tmdb.getMovie(id);
	const { data, error } = MovieSchema.safeParse(res);
	expect(res).not.toBeNull();
	expect(data).not.toBeNull();
});

test('get show', async () => {
	const id = 456;
	const res = await tmdb.getShow(id);
	const { data, error } = ShowSchema.safeParse(res);
	expect(res).not.toBeNull();
	expect(data).not.toBeNull();
});

test('get show season', async () => {
	const id = 456;
	const res = await tmdb.getSeason(id, 1);
	const { data, error } = SeasonResponseSchema.safeParse(res);
	expect(res).not.toBeNull();
	expect(data).not.toBeNull();
});

test('get person', async () => {
	const id = 31;
	const res = await tmdb.getPerson(id);
	const { data, error } = PersonResponseSchema.safeParse(res);
	expect(res).not.toBeNull();
	expect(data).not.toBeNull();
});
