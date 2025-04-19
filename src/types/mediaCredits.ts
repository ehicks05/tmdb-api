import z from 'zod';
import { MediaSchema } from './mediabase.js';
import { MovieSchema } from './movie.js';
import { ShowSchema } from './show.js';

// fields specific to cast/crew credits
const CastSchema = z.object({ character: z.string(), order: z.number() });
const CrewSchema = z.object({ department: z.string(), job: z.string() });

// GET /person/:id/combined_credits
// common to both movie/tv and cast/crew
const PersonCreditBaseSchema = MediaSchema.pick({
	adult: true,
	backdrop_path: true,
	id: true,
	original_language: true,
	overview: true,
	popularity: true,
	poster_path: true,
	vote_average: true,
	vote_count: true,
}).extend({
	credit_id: z.string(),
	genre_ids: z.number().array(),
});
export type PersonCreditBase = z.infer<typeof PersonCreditBaseSchema>;

// fields for a person's movie credit
const MovieCreditSchema = PersonCreditBaseSchema.extend(
	MovieSchema.pick({
		original_title: true,
		release_date: true,
		title: true,
		video: true,
	}),
);

// fields for a person's show credit
const TvCreditSchema = PersonCreditBaseSchema.extend(
	ShowSchema.pick({
		origin_country: true,
		first_air_date: true,
		name: true,
	}).extend({
		episode_count: z.number(),
	}),
);

export const MovieCreditsSchema = z.object({
	cast: z.array(MovieCreditSchema.extend(CastSchema)),
	crew: z.array(MovieCreditSchema.extend(CrewSchema)),
});
export type MovieCredits = z.infer<typeof MovieCreditsSchema>;

export const TvCreditsSchema = z.object({
	cast: z.array(TvCreditSchema.extend(CastSchema.omit({ order: true }))),
	crew: z.array(TvCreditSchema.extend(CrewSchema)),
});
export type TvCredits = z.infer<typeof TvCreditsSchema>;
