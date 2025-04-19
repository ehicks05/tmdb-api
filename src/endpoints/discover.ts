import { type Interval, eachYearOfInterval, format, lastDayOfYear } from 'date-fns';
import { range } from 'lodash-es';
import z from 'zod';
import { client } from '../client/client.js';
import { DiscoverMovieSchema } from '../types/movie.js';
import { DiscoverShowSchema } from '../types/show.js';

const TIME_FIELD = {
	movie: 'primary_release_date',
	tv: 'first_air_date',
};

const DiscoverResponseSchema = z.object({
	page: z.number(),
	results: z.array(z.union([DiscoverMovieSchema, DiscoverShowSchema])),
	total_pages: z.number(),
	total_results: z.number(),
});

const getResultsForInterval = async (path: string) => {
	const { data } = await client(path);

	const resultPages = await Promise.all(
		range(0, data.total_pages).map(async (i) => {
			const { data } = await client(`${path}&page=${i + 1}`);
			const discoveryResponse = DiscoverResponseSchema.parse(data);
			return discoveryResponse.results;
		}),
	);

	return resultPages.flat();
};

export interface Params {
	media: 'movie' | 'tv';
	start?: Date;
	end?: Date;
	minVotes?: number;
}

export const discover = async ({
	media,
	start = new Date(1874, 0, 1),
	end = new Date(),
	minVotes = 0,
}: Params) => {
	// Multi-year ranges are split to avoid the 500 page api limit.
	const intervals = eachYearOfInterval({ start, end }).map((startOfYear) => ({
		start: startOfYear,
		end: lastDayOfYear(startOfYear),
	}));
	intervals[0].start = start;
	intervals[intervals.length - 1].end = end;

	const resultsByYear = await Promise.all(
		intervals.map((interval: Interval) => {
			const params = new URLSearchParams({
				'vote_count.gte': String(minVotes),
				[`${TIME_FIELD[media]}.gte`]: format(interval.start, 'yyyy-MM-dd'),
				[`${TIME_FIELD[media]}.lte`]: format(interval.end, 'yyyy-MM-dd'),
			});
			return getResultsForInterval(`/discover/${media}?${params.toString()}`);
		}),
	);

	return resultsByYear.flat();
};
