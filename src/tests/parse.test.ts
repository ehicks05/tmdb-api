import { expect, test } from 'vitest';
import { ValidMovieSchema, ValidShowSchema } from '../parsers/validation.js';
import { tmdb } from './client.js';
import { PersonResponseSchema } from '../tmdb/types/person.js';
import { SeasonResponseSchema } from '../tmdb/types/season.js';

test('get movie', async () => {
	const id = 89;
	const res = await tmdb.getMovie(id);
	const { data, error } = ValidMovieSchema.safeParse(res);
	expect(res).not.toBeNull();
	expect(data).not.toBeNull();
});

test('get show', async () => {
	const id = 456;
	const res = await tmdb.getShow(id);
	const { data, error } = ValidShowSchema.safeParse(res);
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
