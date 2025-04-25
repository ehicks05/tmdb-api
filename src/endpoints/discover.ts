import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import { DiscoverResponseSchema } from '../types/discover.js';
import type { DiscoverQuery } from '../types/discoverQuery.js';
import {
	type Interval,
	eachYearOfInterval,
	format,
	lastDayOfYear,
} from '../utils/date.js';
import { logError } from '../utils/error.js';
import { range } from '../utils/util.js';

const fetchAllPages = async (
	path: string,
	query: Record<string, string | number | boolean>,
) => {
	try {
		const { data } = await client(path, query);
		const res = DiscoverResponseSchema.parse(data);
		const lastPage = Math.min(res.total_pages, TMDB_PAGE_LIMIT);

		const resultPages = await Promise.all(
			range(1, lastPage + 1).map(async (page) => {
				try {
					const { data } = await client(path, { ...query, page });
					return DiscoverResponseSchema.parse(data).results;
				} catch (error) {
					logError(error);
					return [];
				}
			}),
		);

		return resultPages.flat();
	} catch (error) {
		logError(error);
		return [];
	}
};

const buildAnnualIntervals = (start: Date, end: Date) => {
	const intervals = eachYearOfInterval({ start, end }).map((startOfYear) => ({
		start: startOfYear,
		end: lastDayOfYear(startOfYear),
	}));
	intervals[0].start = start;
	intervals[intervals.length - 1].end = end;

	return intervals;
};

const handleExhaustive = async ({
	media,
	query = {},
}: Omit<DiscoverParams, 'exhaustive'>) => {
	// 1. extract time field from params
	const start =
		'primary_release_date.gte' in query && query['primary_release_date.gte']
			? query['primary_release_date.gte']
			: query && 'first_air_date.gte' in query && query['first_air_date.gte']
				? query['first_air_date.gte']
				: new Date(1874, 0, 1).toISOString();
	const end =
		'primary_release_date.lte' in query && query['primary_release_date.lte']
			? query['primary_release_date.lte']
			: query && 'first_air_date.lte' in query && query['first_air_date.lte']
				? query['first_air_date.lte']
				: new Date().toISOString();

	// 2. remove page and time field
	const timeFieldGte =
		media === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte';
	const timeFieldLte =
		media === 'movie' ? 'primary_release_date.gte' : 'first_air_date.lte';

	const { page, ...query2 } = query;

	// 3. split into yearly intervals to avoid the 500 page api limit
	const intervals = buildAnnualIntervals(new Date(start), new Date(end));

	const resultsByYear = await Promise.all(
		intervals.map((interval: Interval) => {
			return fetchAllPages(`/discover/${media}`, {
				...query2,
				[timeFieldGte]: format(interval.start),
				[timeFieldLte]: format(interval.end),
			});
		}),
	);

	return resultsByYear.flat();
};

export interface DiscoverParams {
	media: 'movie' | 'tv';
	query?: DiscoverQuery;
	exhaustive?: boolean;
}

/**
 * @param exhaustive - if true, will automatically fetch all pages and return
 * an array of all the results.
 */
export const discover = async ({
	media,
	query = {},
	exhaustive = false,
}: DiscoverParams) => {
	try {
		if (exhaustive) {
			return handleExhaustive({ media, query });
		}

		// non-exhaustive mode
		return fetchAllPages(`/discover/${media}`, query);
	} catch (error) {
		logError(error);
	}
};
