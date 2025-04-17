import { TmdbApi, TmdbApi2 } from '../main.js';
import { env } from './env.js';

export const tmdb = new TmdbApi({ api_key: env.TMDB_API_KEY });
export const tmdb2 = new TmdbApi2({ api_key: env.TMDB_API_KEY });
