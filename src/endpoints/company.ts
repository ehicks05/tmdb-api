import { client } from '../client/client.js';
import { CompanySchema } from '../types/company.js';

export const company = async (id: number) => {
	const { data } = await client(`/company/${id}`);
	return CompanySchema.parse(data);
};
