import { type Interval, format, subDays } from 'date-fns';
import { intersection, range } from 'lodash-es';
import type { ThrottledClient } from '../client/client.js';
import type { RecentChangesResponse } from '../types/changes.js';
import { discoverMediaIds } from './discover.js';

export type Resource = 'movie' | 'tv' | 'person';

export const getRecentlyChangedIds = async (
	client: ThrottledClient,
	resource: Resource,
	interval: Interval = { start: subDays(new Date(), 1), end: new Date() },
) => {
	const url = `/${resource}/changes`;
	const start_date = format(interval.start, 'yyyy-MM-dd');
	const end_date = format(interval.end, 'yyyy-MM-dd');

	const {
		data: { total_pages },
	} = await client<RecentChangesResponse>(url, {
		params: { start_date, end_date },
	});

	const pageResults = await Promise.all(
		range(0, total_pages).map(async (i) => {
			const page = i + 1;
			const { data } = await client<RecentChangesResponse>(url, {
				params: { start_date, end_date, page },
			});
			return data.results.map((o) => o.id);
		}),
	);

	const ids = pageResults.flat();

	// filter using /discover
	if (resource === 'person') return ids;

	const discoverIds = await discoverMediaIds(client, resource, true);

	return intersection(ids, discoverIds);
};
