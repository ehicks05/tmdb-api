import { z } from 'zod/v4';
import { CastCreditSchema, CreditsSchema, CrewCreditSchema } from './credits.js';

export const EpisodeSchema = z.object({
	air_date: z.string(),
	crew: z.array(CrewCreditSchema),
	episode_number: z.number(),
	guest_stars: z.array(CastCreditSchema),
	id: z.number(),
	name: z.string(),
	overview: z.string(),
	production_code: z.string().nullable(),
	runtime: z.number().nullable(),
	season_number: z.number(),
	still_path: z.string().nullable(),
	vote_average: z.number(),
	vote_count: z.number(),
});
export type Episode = z.infer<typeof EpisodeSchema>;

export const SeasonSchema = z.object({
	_id: z.string(),
	air_date: z.string().nullable(),
	// episodes: z.array(EpisodeSchema),
	episodes: z.array(z.unknown()), // seeing lots of messed up guest_star objects
	name: z.string(),
	overview: z.string(),
	id: z.number(),
	poster_path: z.string().nullable(),
	season_number: z.number(),
	vote_average: z.number(),
});
export type Season = z.infer<typeof SeasonSchema>;

export const SeasonSummarySchema = SeasonSchema.omit({
	episodes: true,
	_id: true,
}).extend({ episode_count: z.number() });
export type SeasonSummary = z.infer<typeof SeasonSummarySchema>;

export const SeasonResponseSchema = SeasonSchema.extend({ credits: CreditsSchema });
export type SeasonResponse = z.infer<typeof SeasonResponseSchema>;
