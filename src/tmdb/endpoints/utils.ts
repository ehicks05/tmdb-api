import type { AxiosError } from 'axios';
import { pick } from 'lodash-es';

export const logAxiosError = (error: AxiosError) => {
	const config = pick(error.config, ['baseURL', 'url', 'params']);
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
