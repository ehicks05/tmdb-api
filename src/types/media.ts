import { z } from 'zod/v4';
import { MovieSchema } from './movie.js';
import { ShowSchema } from './show.js';

export const MediaResponseSchema = z.union([MovieSchema, ShowSchema]);
export type MediaResponse = z.infer<typeof MediaResponseSchema>;
