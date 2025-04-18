import { client } from '../client/client.js';
import { type GenreResponse, GenreResponseSchema } from '../types/genre.js';

const getMovieGenres = async () => {
	const { data } = await client('/genre/movie/list');
	return GenreResponseSchema.parse(data).genres;
};

const getShowGenres = async () => {
	const { data } = await client('/genre/tv/list');
	return GenreResponseSchema.parse(data).genres;
};

type GenreWithType = GenreResponse['genres'][number] & {
	type: 'MOVIE' | 'SHOW' | 'BOTH';
};

export const getGenres = async () => {
	const [_movieGenres, _showGenres] = await Promise.all([
		getMovieGenres(),
		getShowGenres(),
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
