import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import pThrottle, { type ThrottledFunction } from 'p-throttle';
import { TMDB_API_INTERVAL, TMDB_API_LIMIT } from '../constants.js';
import { configureHttp } from './configure-http.js';

configureHttp();

const BASE_URL = 'https://api.themoviedb.org/3';

export interface ThrottledClientParams {
	api_key: string;
	limit?: number;
	interval?: number;
}

let client: ThrottledClient;

const getClient = ({
	api_key,
	limit = TMDB_API_LIMIT,
	interval = TMDB_API_INTERVAL,
}: ThrottledClientParams) => {
	if (client) return client;
	const _client = axios.create({ baseURL: BASE_URL, params: { api_key } });
	const throttle = pThrottle({ limit, interval });
	client = throttle(_client.get);
	return client;
};

export { client, getClient };

export type ThrottledClient = ThrottledFunction<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	<T = any, R = AxiosResponse<T, any>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>,
	) => Promise<R>
>;
