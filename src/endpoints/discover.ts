import querystring from 'node:querystring';
import { type Interval, eachYearOfInterval, format, lastDayOfYear } from 'date-fns';
import { range } from 'lodash-es';
import { client } from '../client/client.js';
import { TMDB_PAGE_LIMIT } from '../constants.js';
import { DiscoverResponseSchema } from '../types/discover.js';
import type { DiscoverQuery } from '../types/discoverQuery.js';

const fetchAllPages = async (url: string) => {
	const { data } = await client(url);

	const lastPage = Math.min(data.total_pages, TMDB_PAGE_LIMIT);

	const resultPages = await Promise.all(
		range(1, lastPage + 1).map(async (page) => {
			const { data } = await client(`${url}&page=${page}`);
			const discoveryResponse = DiscoverResponseSchema.parse(data);
			return discoveryResponse.results;
		}),
	);

	return resultPages.flat();
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
	if (exhaustive) {
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
				const qs = querystring.stringify({
					...query2,
					[timeFieldGte]: format(interval.start, 'yyyy-MM-dd'),
					[timeFieldLte]: format(interval.end, 'yyyy-MM-dd'),
				});

				return fetchAllPages(`/discover/${media}?${qs}`);
			}),
		);

		return resultsByYear.flat();
	}

	// standard mode
	const qs = querystring.stringify(query);
	return fetchAllPages(`/discover/${media}?${qs}`);
};
