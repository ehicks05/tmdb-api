import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import pThrottle, { type ThrottledFunction } from 'p-throttle';
import { configureHttp } from '../../utils/configure-http.js';

configureHttp();

const BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LIMIT = 40;
const DEFAULT_INTERVAL = 1000;

export interface ThrottledClientParams {
	api_key: string;
	limit?: number;
	interval?: number;
}

const getClient = ({
	api_key,
	limit = DEFAULT_LIMIT,
	interval = DEFAULT_INTERVAL,
}: ThrottledClientParams) => {
	const client = axios.create({ baseURL: BASE_URL, params: { api_key } });
	const throttle = pThrottle({ limit, interval });
	return throttle(client.get);
};

export { getClient };

export type ThrottledAxiosClient = ThrottledFunction<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	<T = any, R = AxiosResponse<T, any>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>,
	) => Promise<R>
>;
