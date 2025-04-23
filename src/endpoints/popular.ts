import { range } from 'lodash-es';
import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import type { PopularPersonPage } from '../types/person.js';
import { logError } from './utils.js';

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

		const { data } = await client<PopularPersonPage>(url);

		const lastPage = Math.min(data.total_pages, pages, TMDB_PAGE_LIMIT);

		const pageResults = await Promise.all(
			range(1, lastPage + 1).map(async (page) => {
				const { data } = await client<PopularPersonPage>(url, {
					params: { page },
				});
				return data.results;
			}),
		);

		return pageResults.flat();
	} catch (error) {
		logError(error);
	}
};
