import { type Interval, format, subDays } from 'date-fns';
import { range } from 'lodash-es';
import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import type { RecentChangesResponse } from '../types/changes.js';
import { logError } from './utils.js';

const fetchAllPages = async (url: string, params: Record<string, string>) => {
	const { data } = await client<RecentChangesResponse>(url, { params });

	const lastPage = Math.min(data.total_pages, TMDB_PAGE_LIMIT);

	const pageResults = await Promise.all(
		range(1, lastPage + 1).map(async (page) => {
			const { data } = await client<RecentChangesResponse>(url, {
				params: { ...params, page },
			});
			return data.results.map((o) => o.id);
		}),
	);

	return pageResults.flat();
};

export type Resource = 'movie' | 'tv' | 'person';
const INTERVAL = { start: subDays(new Date(), 1), end: new Date() };

export const changes = async (resource: Resource, interval: Interval = INTERVAL) => {
	try {
		const results = await fetchAllPages(`/${resource}/changes`, {
			start_date: format(interval.start, 'yyyy-MM-dd'),
			end_date: format(interval.end, 'yyyy-MM-dd'),
		});
		return results;
	} catch (error) {
		logError(error);
	}
};
