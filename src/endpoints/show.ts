import z from 'zod';
import { client } from '../client/client.js';
import { type Credits, CreditsSchema } from '../types/credits.js';
import {
	type AppendedProviders,
	AppendedProvidersSchema,
	type ContentRatings,
	ContentRatingsSchema,
	type MediaImages,
	MediaImagesSchema,
	type Show,
	ShowSchema,
} from '../types/index.js';
import { toParams } from './utils.js';

export type ShowAppends = {
	content_ratings?: boolean;
	credits?: boolean;
	images?: boolean;
	'watch/providers'?: boolean;
};

type ShowResult<T extends ShowAppends> = Show &
	(T extends { content_ratings: true } ? { content_ratings: ContentRatings } : {}) &
	(T extends { credits: true } ? { credits: Credits } : {}) &
	(T extends { images: true } ? { images: MediaImages } : {}) &
	(T extends { 'watch/providers': true }
		? { 'watch/providers': AppendedProviders }
		: {});

interface Params<T extends ShowAppends> {
	id: number;
	appends?: T;
}

const getSchema = (appends?: ShowAppends) =>
	ShowSchema.extend({
		content_ratings: appends?.content_ratings
			? ContentRatingsSchema.required()
			: z.null().optional(),
		credits: appends?.credits ? CreditsSchema.required() : z.null().optional(),
		images: appends?.images ? MediaImagesSchema.required() : z.null().optional(),
		'watch/providers': appends?.['watch/providers']
			? AppendedProvidersSchema.required()
			: z.null().optional(),
	});

export async function getShow<T extends ShowAppends>({ id, appends }: Params<T>) {
	const { data } = await client(`/tv/${id}`, toParams(appends));

	const parsed = getSchema(appends).parse(data) as ShowResult<T>;

	return parsed;
}
