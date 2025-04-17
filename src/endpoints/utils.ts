import type { AxiosError } from 'axios';

const logAxiosError = (error: AxiosError) => {
	const { baseURL, url, params } = error.config || {};
	const config = { baseURL, url, params };

	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		const { data, status, headers } = error.response;
		if ([404, 429].includes(status)) console.log({ status, url: config.url });
		else console.log({ data, status, config /* headers */ });
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.log({ request: error.request, config });
	} else {
		// Something happened in setting up the request that triggered an Error
		console.log({ errorMessage: error.message, config });
	}
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const asyncWrapper = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
	return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
		try {
			return await fn(...args);
		} catch (error) {
			logAxiosError(error as AxiosError);
			throw error;
		}
	};
};

export const toParams = (appends?: Record<string, boolean>) => ({
	params: {
		append_to_response: Object.entries(appends || {})
			.filter(([, v]) => v)
			.map(([k]) => k)
			.join(','),
	},
});
