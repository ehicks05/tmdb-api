import { TmdbApi } from '../main.js';
import { env } from './env.js';

export const tmdb = new TmdbApi({ api_key: env.TMDB_API_KEY });
