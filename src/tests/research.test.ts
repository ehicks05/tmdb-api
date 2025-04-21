import { AxiosError } from 'axios';
import pMap from 'p-map';
import { test } from 'vitest';
import z from 'zod';
import type { MovieResult } from '../endpoints/movie.js';
import { logAxiosError } from '../endpoints/utils.js';
import { tmdb } from './client.js';

const checkMovie = async (
	movie: MovieResult<{
		credits: true;
	}>,
) => {
	const { cast, crew } = movie.credits;

	const failingCredits = [...cast, ...crew].filter(
		(c) =>
			c.known_for_department === null ||
			c.known_for_department === undefined ||
			c.known_for_department === '',
	);

	if (failingCredits.length > 0) {
		console.log(movie.title);
		console.log(failingCredits.map((o) => o.id));
	}
};

const findRecentUnpopularMovieIds = async () => {
	const discoverMovies = await tmdb.discover({
		media: 'movie',
		sortBy: 'popularity.asc',
		start: new Date(2025, 0, 1),
	});
	return discoverMovies.map((o) => o.id);
};

const lookForBadData = async () => {
	console.log('start');

	// unpopular movies are more likely to be missing data
	const movieIds = await findRecentUnpopularMovieIds();

	await pMap(movieIds, async (id) => {
		try {
			const movie = await tmdb.movie({ id, appends: { credits: true } });
			checkMovie(movie);
		} catch (e) {
			console.log(`issue with movie ${id}:`);
			if (e instanceof z.ZodError) {
				console.log(z.prettifyError(e));
			} else if (e instanceof AxiosError) {
				logAxiosError(e);
			} else {
				console.log(e);
			}
		}
	});

	console.log('done');
};

test('research', { skip: true, timeout: 0 }, async () => {
	await lookForBadData();
});
