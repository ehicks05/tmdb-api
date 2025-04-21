import { z } from 'zod';
import { PageSchema } from './page.js';

export const RecentChangesResponseSchema = PageSchema.extend({
	results: z.array(
		z.object({
			id: z.number(),
			adult: z.boolean(),
		}),
	),
});
export type RecentChangesResponse = z.infer<typeof RecentChangesResponseSchema>;
