import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import {
	type RecentChangesParams,
	RecentChangesResponseSchema,
} from '../types/changes.js';
import { type Interval, format, subDays } from '../utils/date.js';
import { logError } from '../utils/error.js';
import { range } from '../utils/util.js';

const fetchAllPages = async (path: string, params: RecentChangesParams) => {
	const { data } = await client(path, params);
	const res = RecentChangesResponseSchema.parse(data);

	const lastPage = Math.min(res.total_pages, TMDB_PAGE_LIMIT);

	const pageResults = await Promise.all(
		range(1, lastPage + 1).map(async (page) => {
			const { data } = await client(path, { ...params, page });
			const res = RecentChangesResponseSchema.parse(data);
			return res.results.map((o) => o.id);
		}),
	);

	return pageResults.flat();
};

export type Resource = 'movie' | 'tv' | 'person';
const INTERVAL = { start: subDays(new Date(), 1), end: new Date() };

export const changes = async (resource: Resource, interval: Interval = INTERVAL) => {
	try {
		const results = await fetchAllPages(`/${resource}/changes`, {
			start_date: format(interval.start),
			end_date: format(interval.end),
		});
		return results;
	} catch (error) {
		logError(error);
	}
};
