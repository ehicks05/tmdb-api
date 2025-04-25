import { client } from '../client/client.js';
import { ProviderResponseSchema } from '../types/provider.js';
import { logError } from '../utils/error.js';

export const providers = async () => {
	try {
		const { data } = await client('/watch/providers/movie', {
			params: { watch_region: 'US' },
		});
		return ProviderResponseSchema.parse(data).results;
	} catch (error) {
		logError(error);
	}
};
