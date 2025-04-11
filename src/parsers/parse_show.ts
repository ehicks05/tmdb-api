import type { ShowResponse } from '../types/show.js';
import { ValidTrimmedShowSchema } from './validation.js';

export const parseShow = (_data: ShowResponse) => {
	const { data, error } = ValidTrimmedShowSchema.safeParse(_data);

	if (error) {
		console.log(error);
		return undefined;
	}

	return {
		id: data.id,
		cast: data.credits.cast
			.slice(0, 3)
			.map((c) => c.name)
			.join(', '),
		contentRating:
			data.content_ratings?.results.find((r) => r.iso_3166_1 === 'US' && r.rating)
				?.rating || '',
		createdBy:
			data.created_by
				.slice(0, 3)
				.map((o) => o.name)
				.join(', ') || '',
		genreId: data.genres[0].id,
		firstAirDate: new Date(data.first_air_date),
		languageId: data.original_language,
		lastAirDate: data.last_air_date ? new Date(data.last_air_date) : '',
		name: data.name,
		overview: data.overview || '',
		popularity: data.popularity,
		posterPath: data.poster_path || '',
		status: data.status,
		tagline: data.tagline,
		voteCount: data.vote_count,
		voteAverage: data.vote_average,
	};
};
