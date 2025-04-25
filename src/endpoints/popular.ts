import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import { PopularPersonPageSchema } from '../types/person.js';
import { logError } from '../utils/error.js';
import { range } from '../utils/util.js';

export type Resource = 'person';

export interface PopularParams {
	resource: Resource;
	pages?: number;
}

/**
 * Popular movies and shows can be found using the discover endpoint.
 * There is no discover for people, so this exists.
 */
export const popular = async ({ resource, pages = 1 }: PopularParams) => {
	try {
		const url = `/${resource}/popular`;

		const { data } = await client(url);
		const res = PopularPersonPageSchema.parse(data);

		const lastPage = Math.min(res.total_pages, pages, TMDB_PAGE_LIMIT);

		const pageResults = await Promise.all(
			range(1, lastPage + 1).map(async (page) => {
				const { data } = await client(url, { page });
				const res = PopularPersonPageSchema.parse(data);
				return res.results;
			}),
		);

		return pageResults.flat();
	} catch (error) {
		logError(error);
	}
};
