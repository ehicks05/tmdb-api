import z from 'zod';
import { client } from '../client/client.js';
import { type Credits, CreditsSchema } from '../types/credits.js';
import {
	type AppendedProviders,
	AppendedProvidersSchema,
	type Season,
	type SeasonImages,
	SeasonImagesSchema,
	SeasonSchema,
} from '../types/index.js';
import { logError } from '../utils/error.js';
import { toParams } from '../utils/util.js';

export type SeasonAppends = {
	credits?: boolean;
	images?: boolean;
	'watch/providers'?: boolean;
};

type SeasonResult<T extends SeasonAppends> = Season &
	(T extends { credits: true } ? { credits: Credits } : {}) &
	(T extends { images: true } ? { images: SeasonImages } : {}) &
	(T extends { 'watch/providers': true }
		? { 'watch/providers': AppendedProviders }
		: {});

interface Params<T extends SeasonAppends> {
	showId: number;
	seasonNumber: number;
	appends?: T;
}

const getSchema = (appends?: SeasonAppends) =>
	SeasonSchema.extend({
		credits: appends?.credits ? CreditsSchema.required() : z.null().optional(),
		images: appends?.images ? SeasonImagesSchema.required() : z.null().optional(),
		'watch/providers': appends?.['watch/providers']
			? AppendedProvidersSchema.required()
			: z.null().optional(),
	});

export async function season<T extends SeasonAppends>({
	showId,
	seasonNumber,
	appends,
}: Params<T>) {
	try {
		const { data } = await client(
			`/tv/${showId}/season/${seasonNumber}`,
			toParams(appends),
		);
		return getSchema(appends).parse(data) as SeasonResult<T>;
	} catch (error) {
		logError(error);
	}
}
