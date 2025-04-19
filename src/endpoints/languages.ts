import { client } from '../client/client.js';
import { LanguageResponseSchema } from '../types/language.js';

export const getLanguages = async () => {
	const { data } = await client('/configuration/languages');
	return LanguageResponseSchema.parse(data);
};
