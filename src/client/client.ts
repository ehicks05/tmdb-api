import querystring from 'node:querystring';
import pThrottle, { type ThrottledFunction } from 'p-throttle';
import { TMDB_BASE_URL, TMDB_RATE_LIMIT } from '../constants.js';
import { FetchError } from '../utils/error.js';

type ThrottledFetch = ThrottledFunction<
	(
		path: string,
		params?: Record<string, string | number | boolean>,
		init?: RequestInit,
	) => Promise<{ data: unknown }>
>;
let client: ThrottledFetch;

export interface ThrottledClientParams {
	api_key: string;
	limit?: number;
	interval?: number;
}

interface CreateFetchParams {
	baseURL: string;
	api_key: string;
}

const createFetch =
	({ baseURL, api_key }: CreateFetchParams) =>
	async (
		path: string,
		params?: Record<string, string | number | boolean>,
		init?: RequestInit,
	) => {
		const qs = querystring.stringify({ api_key, ...params });
		const response = await fetch(`${baseURL}${path}?${qs}`, { ...init });
		if (!response.ok) {
			throw new FetchError(response.statusText, { path, params });
		}
		const data = await response.json();
		return { data };
	};

const getClient = ({
	api_key,
	limit = TMDB_RATE_LIMIT.LIMIT,
	interval = TMDB_RATE_LIMIT.INTERVAL_MS,
}: ThrottledClientParams) => {
	if (client) return client;
	const _client = createFetch({ baseURL: TMDB_BASE_URL, api_key });
	const throttle = pThrottle({ limit, interval });
	client = throttle(_client);
	return client;
};

export { client, getClient };
