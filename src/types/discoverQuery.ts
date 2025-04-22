import z from 'zod';

const SortDirection = z.enum(['asc', 'desc']);

export const DiscoverSharedQuerySchema = z.object({
	include_adult: z.boolean().default(false),
	language: z.string().default('en-US'),
	page: z.int().min(1).max(500).default(1),
	sort_by: z
		.templateLiteral([
			z.literal(['popularity', 'vote_average', 'vote_count']),
			'.',
			SortDirection,
		])
		.default('popularity.desc'),
	'vote_average.gte': z.number(),
	'vote_average.lte': z.number(),
	'vote_count.gte': z.int(),
	'vote_count.lte': z.int(),
	watch_region: z.string(),
	with_companies: z.string(),
	with_genres: z.string(),
	with_keywords: z.string(),
	with_origin_country: z.string(),
	with_original_language: z.string(),
	'with_runtime.gte': z.int(),
	'with_runtime.lte': z.int(),
	with_watch_monetization: z.string(),
	with_watch_providers: z.string(),
	without_companies: z.string(),
	without_genres: z.string(),
	without_keywords: z.string(),
	without_watch_providers: z.string(),
});

export const DiscoverMovieQuerySchema = DiscoverSharedQuerySchema.extend({
	certification: z.string(),
	'certification.gte': z.string(),
	'certification.lte': z.string(),
	certification_country: z.string(),
	include_video: z.boolean().default(false),
	primary_release_year: z.int(),
	'primary_release_date.gte': z.iso.date(),
	'primary_release_date.lte': z.iso.date(),
	region: z.string(),
	'release_date.gte': z.iso.date(),
	'release_date.lte': z.iso.date(),
	sort_by: z
		.templateLiteral([
			z.literal([
				'original_title',
				'popularity',
				'primary_release_date',
				'revenue',
				'title',
				'vote_average',
				'vote_count',
			]),
			'.',
			SortDirection,
		])
		.default('popularity.desc'),
	with_cast: z.string(),
	with_crew: z.string(),
	with_people: z.string(),
	with_release_type: z.string(),
	year: z.int(),
}).partial();
export type DiscoverMovieQuery = z.infer<typeof DiscoverMovieQuerySchema>;

export const DiscoverTvQuerySchema = DiscoverSharedQuerySchema.extend({
	'air_date.gte': z.iso.date(),
	'air_date.lte': z.iso.date(),
	first_air_date_year: z.int(),
	'first_air_date.gte': z.iso.date(),
	'first_air_date.lte': z.iso.date(),
	include_null_first_air_dates: z.boolean().default(false),
	screened_theatrically: z.boolean(),
	sort_by: z
		.templateLiteral([
			z.literal([
				'first_air_date',
				'name',
				'original_name',
				'popularity',
				'vote_average',
				'vote_count',
			]),
			'.',
			SortDirection,
		])
		.default('popularity.desc'),
	timezone: z.string(),
	with_networks: z.int(),
	with_status: z.string(),
	with_type: z.string(),
}).partial();
export type DiscoverTvQuery = z.infer<typeof DiscoverTvQuerySchema>;

export const DiscoverQuerySchema = z.union([
	DiscoverMovieQuerySchema,
	DiscoverTvQuerySchema,
]);
export type DiscoverQuery = z.infer<typeof DiscoverQuerySchema>;
