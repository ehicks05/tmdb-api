import { z } from 'zod';
import { MediaSchema, MovieStatusEnum } from './mediabase.js';

export const CollectionSchema = z.object({
	id: z.number(),
	name: z.string(),
	overview: z.string().optional(),
	poster_path: z.string().nullable(),
	backdrop_path: z.string().nullable(),
});
export type Collection = z.infer<typeof CollectionSchema>;

export const ReleasesSchema = z.object({
	countries: z.array(
		z.object({
			certification: z.string(),
			iso_3166_1: z.string(),
			primary: z.boolean(),
			release_date: z.string(),
		}),
	),
});
export type Releases = z.infer<typeof ReleasesSchema>;

export const MovieSchema = MediaSchema.extend({
	belongs_to_collection: CollectionSchema.nullable(),
	budget: z.number(),
	imdb_id: z.string().nullable(),
	original_title: z.string(),
	release_date: z.string(),
	revenue: z.number(),
	runtime: z.number().nullable(),
	status: MovieStatusEnum,
	title: z.string(),
	video: z.boolean(),
});
export type Movie = z.infer<typeof MovieSchema>;
