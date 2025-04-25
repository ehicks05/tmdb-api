import { client } from '../client/client.js';
import { CertificationResponseSchema } from '../types/certifications.js';
import { logError } from '../utils/error.js';

export const certifications = async (media: 'movie' | 'tv') => {
	try {
		const { data } = await client(`/certification/${media}/list`);
		return CertificationResponseSchema.parse(data).certifications;
	} catch (error) {
		logError(error);
	}
};
