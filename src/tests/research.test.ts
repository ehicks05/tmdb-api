import pMap from 'p-map';
import { test } from 'vitest';
import type { MovieResult } from '../endpoints/movie.js';
import { logError } from '../utils/error.js';
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
		query: {
			sort_by: 'popularity.asc',
			'primary_release_date.gte': '2025-01-01)',
		},
	});
	return discoverMovies?.map((o) => o.id);
};

const lookForBadData = async () => {
	console.log('start');

	// unpopular movies are more likely to be missing data
	const movieIds = (await findRecentUnpopularMovieIds()) || [];

	await pMap(movieIds, async (id) => {
		try {
			const movie = await tmdb.movie({ id, appends: { credits: true } });
			if (movie) checkMovie(movie);
		} catch (e) {
			logError(e);
		}
	});

	console.log('done');
};

test('research', { skip: true, timeout: 0 }, async () => {
	await lookForBadData();
});
