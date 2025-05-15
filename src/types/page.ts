import { z } from 'zod/v4';

export const PageSchema = z.object({
	page: z.number(),
	results: z.array(z.unknown()),
	total_pages: z.number(),
	total_results: z.number(),
});
