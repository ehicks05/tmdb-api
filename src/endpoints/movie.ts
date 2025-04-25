import z from 'zod';
import { client } from '../client/client.js';
import { type Credits, CreditsSchema } from '../types/credits.js';
import {
	type AppendedProviders,
	AppendedProvidersSchema,
	type MediaImages,
	MediaImagesSchema,
} from '../types/index.js';
import {
	type Movie,
	MovieSchema,
	type Releases,
	ReleasesSchema,
} from '../types/movie.js';
import { logError } from '../utils/error.js';
import { toParams } from '../utils/util.js';

export type MovieAppends = {
	credits?: boolean;
	images?: boolean;
	releases?: boolean;
	'watch/providers'?: boolean;
};

export type MovieResult<T extends MovieAppends> = Movie &
	(T extends { credits: true } ? { credits: Credits } : {}) &
	(T extends { images: true } ? { images: MediaImages } : {}) &
	(T extends { releases: true } ? { releases: Releases } : {}) &
	(T extends { 'watch/providers': true }
		? { 'watch/providers': AppendedProviders }
		: {});

export interface Params<T extends MovieAppends> {
	id: number;
	appends?: T;
}

const getSchema = (appends?: MovieAppends) =>
	MovieSchema.extend({
		credits: appends?.credits ? CreditsSchema.required() : z.null().optional(),
		images: appends?.images ? MediaImagesSchema.required() : z.null().optional(),
		releases: appends?.releases ? ReleasesSchema.required() : z.null().optional(),
		'watch/providers': appends?.['watch/providers']
			? AppendedProvidersSchema.required()
			: z.null().optional(),
	});

export async function movie<T extends MovieAppends>({ id, appends }: Params<T>) {
	try {
		const { data } = await client(`/movie/${id}`, toParams(appends));
		return getSchema(appends).parse(data) as MovieResult<T>;
	} catch (error) {
		logError(error);
	}
}
