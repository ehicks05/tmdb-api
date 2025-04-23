import { client } from '../client/client.js';
import { type GenreResponse, GenreResponseSchema } from '../types/genre.js';
import { logError } from './utils.js';

const movieGenres = async () => {
	const { data } = await client('/genre/movie/list');
	return GenreResponseSchema.parse(data).genres;
};

const showGenres = async () => {
	const { data } = await client('/genre/tv/list');
	return GenreResponseSchema.parse(data).genres;
};

type Genre = GenreResponse['genres'][number];
type GenreWithType = Genre & { type: 'MOVIE' | 'SHOW' | 'BOTH' };

const applyType = (_movieGenres: Genre[], _showGenres: Genre[]) => {
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

export const genres = async () => {
	try {
		const [_movieGenres, _showGenres] = await Promise.all([
			movieGenres(),
			showGenres(),
		]);

		const genres = applyType(_movieGenres, _showGenres);
		return genres;
	} catch (error) {
		logError(error);
	}
};
