import 'dotenv/config';
import { TmdbApi } from '../main.js';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
	throw new Error('missing api key');
}

export const tmdb = new TmdbApi({ api_key: TMDB_API_KEY });
