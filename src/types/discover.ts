import z from 'zod';
import { MediaSchema } from './mediabase.js';
import { MovieSchema } from './movie.js';
import { PageSchema } from './page.js';
import { ShowSchema } from './show.js';

export const DiscoverMedia = MediaSchema.omit({
	genres: true,
	homepage: true,
	production_companies: true,
	production_countries: true,
	spoken_languages: true,
	status: true,
	tagline: true,
}).extend({
	genre_ids: z.number().array(),
});

export const DiscoverMovieSchema = DiscoverMedia.extend(
	MovieSchema.pick({
		original_title: true,
		release_date: true,
		title: true,
		video: true,
	}),
);

export const DiscoverShowSchema = DiscoverMedia.extend(
	ShowSchema.pick({
		first_air_date: true,
		name: true,
		origin_country: true,
		original_name: true,
	}),
);

export const DiscoverResponseSchema = PageSchema.extend({
	results: z.array(z.union([DiscoverMovieSchema, DiscoverShowSchema])),
});
