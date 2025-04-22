import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import pThrottle, { type ThrottledFunction } from 'p-throttle';
import { TMDB_BASE_URL, TMDB_RATE_LIMIT } from '../constants.js';
import { configureHttp } from './configure-http.js';

configureHttp();

type ThrottledClient = ThrottledFunction<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	<T = any, R = AxiosResponse<T, any>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>,
	) => Promise<R>
>;
let client: ThrottledClient;

export interface ThrottledClientParams {
	api_key: string;
	limit?: number;
	interval?: number;
}

const getClient = ({
	api_key,
	limit = TMDB_RATE_LIMIT.LIMIT,
	interval = TMDB_RATE_LIMIT.INTERVAL_MS,
}: ThrottledClientParams) => {
	if (client) return client;
	const _client = axios.create({ baseURL: TMDB_BASE_URL, params: { api_key } });
	const throttle = pThrottle({ limit, interval });
	client = throttle(_client.get);
	return client;
};

export { client, getClient };
