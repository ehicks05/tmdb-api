import { client } from '../client/client.js';
import { CertificationResponseSchema } from '../types/certifications.js';

export const certifications = async (media: 'movie' | 'tv') => {
	const { data } = await client(`/certification/${media}/list`);
	return CertificationResponseSchema.parse(data);
};
