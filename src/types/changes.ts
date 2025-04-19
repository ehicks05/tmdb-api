import { z } from 'zod';

export const RecentChangesResponseSchema = z.object({
	results: z.array(
		z.object({
			id: z.number(),
			adult: z.boolean(),
		}),
	),
	page: z.number(),
	total_pages: z.number(),
	total_results: z.number(),
});
export type RecentChangesResponse = z.infer<typeof RecentChangesResponseSchema>;
