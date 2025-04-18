import z from 'zod';
import { client } from '../client/client.js';
import {
	type MovieCredits,
	MovieCreditsSchema,
	type Person,
	type PersonImages,
	PersonImagesSchema,
	PersonSchema,
	type TvCredits,
	TvCreditsSchema,
} from '../types/index.js';
import { toParams } from './utils.js';

type Appends = {
	movie_credits?: boolean;
	tv_credits?: boolean;
	images?: boolean;
};

type PersonResult<T extends Appends> = Person &
	(T extends { movie_credits: true } ? { movie_credits: MovieCredits } : {}) &
	(T extends { tv_credits: true } ? { tv_credits: TvCredits } : {}) &
	(T extends { images: true } ? { images: PersonImages } : {});

interface Params<T extends Appends> {
	id: number;
	appends?: T;
}

const getSchema = (appends?: Appends) =>
	PersonSchema.extend({
		movie_credits: appends?.movie_credits
			? MovieCreditsSchema.required()
			: z.null().optional(),
		tv_credits: appends?.tv_credits
			? TvCreditsSchema.required()
			: z.null().optional(),
		images: appends?.images ? PersonImagesSchema.required() : z.null().optional(),
	});

export async function getPerson<T extends Appends>({ id, appends }: Params<T>) {
	const { data } = await client(`/person/${id}`, toParams(appends));

	const parsed = getSchema(appends).parse(data) as PersonResult<T>;

	return parsed;
}
