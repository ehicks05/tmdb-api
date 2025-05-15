import { z } from 'zod/v4';
import { PageSchema } from './page.js';

export const RecentChangesParamsSchema = z
	.object({
		end_date: z.iso.date(),
		page: z.number(),
		start_date: z.iso.date(),
	})
	.partial();
export type RecentChangesParams = z.infer<typeof RecentChangesParamsSchema>;

export const RecentChangesResponseSchema = PageSchema.extend({
	results: z.array(
		z.object({
			id: z.number(),
			adult: z.boolean().nullable(),
		}),
	),
});
export type RecentChangesResponse = z.infer<typeof RecentChangesResponseSchema>;
