import { client } from '../client/client.js';
import { ProviderResponseSchema } from '../types/provider.js';

export const getProviders = async () => {
	const config = { params: { watch_region: 'US' } };
	const { data } = await client('/watch/providers/movie', config);
	return ProviderResponseSchema.parse(data).results;
};
