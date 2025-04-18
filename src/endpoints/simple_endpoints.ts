import type { ZodError } from 'zod';
import type { ThrottledClient } from '../client/client.js';
import { LanguageResponseSchema } from '../types/language.js';
import { MovieResponseSchema } from '../types/movie.js';
import { PersonResponseSchema } from '../types/person.js';
import { ProviderResponseSchema } from '../types/provider.js';
import { SeasonResponseSchema } from '../types/season.js';
import { ShowResponseSchema } from '../types/show.js';

export const getMovie = async (client: ThrottledClient, id: number) => {
	const append = ['releases', 'credits', 'watch/providers'];
	const config = { params: { append_to_response: append.join(',') } };
	const { data } = await client(`/movie/${id}`, config);
	return MovieResponseSchema.parse(data);
};

export const getShow = async (client: ThrottledClient, id: number) => {
	const append = ['credits', 'watch/providers', 'content_ratings'];
	const config = { params: { append_to_response: append.join(',') } };
	const { data } = await client(`/tv/${id}`, config);
	return ShowResponseSchema.parse(data);
};

export const getSeason = async (
	client: ThrottledClient,
	showId: number,
	season: number,
) => {
	const append = ['credits'];
	const config = { params: { append_to_response: append.join(',') } };
	const path = `/tv/${showId}/season/${season}`;
	const { data } = await client(path, config);

	// todo - wrap all parses in try catch?
	try {
		return SeasonResponseSchema.parse(data);
	} catch (e) {
		console.log({ showId, season });
		console.log((e as ZodError).issues);
	}
};

export const getPerson = async (client: ThrottledClient, id: number) => {
	const append = [''];
	const config = {
		params: { append_to_response: append.join(',') },
	};
	const { data } = await client(`/person/${id}`, config);

	try {
		return PersonResponseSchema.parse(data);
	} catch (e) {
		// ignore expected issues
		const EXPECTED_ISSUES = ['missing known_for_department'];
		const issues = (e as ZodError).issues.filter(
			(issue) => !EXPECTED_ISSUES.includes(issue.message),
		);

		if (issues && issues.length > 0) {
			console.log(`error for ${id}`);
			console.log(issues);
		}
	}
};

export const getLanguages = async (client: ThrottledClient) => {
	const { data } = await client('/configuration/languages');
	return LanguageResponseSchema.parse(data);
};

export const getProviders = async (client: ThrottledClient) => {
	const config = { params: { watch_region: 'US' } };
	const { data } = await client('/watch/providers/movie', config);
	return ProviderResponseSchema.parse(data).results;
};

import { type GenreResponse, GenreResponseSchema } from '../types/genre.js';

const getMovieGenres = async (client: ThrottledClient) => {
	const { data } = await client('/genre/movie/list');
	return GenreResponseSchema.parse(data).genres;
};

const getShowGenres = async (client: ThrottledClient) => {
	const { data } = await client('/genre/tv/list');
	return GenreResponseSchema.parse(data).genres;
};

type GenreWithType = GenreResponse['genres'][number] & {
	type: 'MOVIE' | 'SHOW' | 'BOTH';
};

export const getGenres = async (client: ThrottledClient) => {
	const [_movieGenres, _showGenres] = await Promise.all([
		getMovieGenres(client),
		getShowGenres(client),
	]);

	// if a genre exists in both lists, update its type to 'BOTH'
	const movieGenres = _movieGenres.map((movieGenre) => {
		const isBoth = _showGenres.some((showGenre) => showGenre.id === movieGenre.id);
		return { ...movieGenre, type: isBoth ? 'BOTH' : 'MOVIE' };
	});
	const movieGenreIds = movieGenres.map((o) => o.id);

	// remove dupes from showGenres
	const showGenres = _showGenres
		.map((o) => ({ ...o, type: 'SHOW' }))
		.filter((showGenre) => !movieGenreIds.includes(showGenre.id));

	return [...movieGenres, ...showGenres] as GenreWithType[];
};
