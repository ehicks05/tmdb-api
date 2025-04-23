import { client } from '../client/client.js';
import { CompanySchema } from '../types/company.js';
import { logError } from './utils.js';

export const company = async (id: number) => {
	try {
		const { data } = await client(`/company/${id}`);
		return CompanySchema.parse(data);
	} catch (error) {
		logError(error);
	}
};
