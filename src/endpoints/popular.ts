import { range } from 'lodash-es';
import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import type { PopularPersonPage } from '../types/person.js';

export type Resource = 'person';

interface Params {
	resource: Resource;
	pages?: number;
}

/**
 * Popular movies and shows can be found using the discover endpoint.
 * There is no discover for people, so this exists.
 */
export const popular = async ({ resource, pages = 1 }: Params) => {
	const url = `/${resource}/popular`;

	const {
		data: { total_pages },
	} = await client<PopularPersonPage>(url, {
		params: {},
	});

	const lastPage = Math.min(total_pages, pages, TMDB_PAGE_LIMIT);

	const pageResults = await Promise.all(
		range(0, lastPage).map(async (i) => {
			const page = i + 1;
			const { data } = await client<PopularPersonPage>(url, {
				params: { page },
			});
			return data.results;
		}),
	);

	const results = pageResults.flat();
	return results;
};
