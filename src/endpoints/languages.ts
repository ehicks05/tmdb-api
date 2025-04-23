import { client } from '../client/client.js';
import { LanguageResponseSchema } from '../types/language.js';
import { logError } from './utils.js';

export const languages = async () => {
	try {
		const { data } = await client('/configuration/languages');
		return LanguageResponseSchema.parse(data);
	} catch (error) {
		logError(error);
	}
};
