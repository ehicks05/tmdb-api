import { z } from 'zod';
import { MovieSchema } from './movie.js';
import { ShowSchema } from './show.js';

export const MediaResponseSchema = z.union([MovieSchema, ShowSchema]);
export type MediaResponse = z.infer<typeof MediaResponseSchema>;
