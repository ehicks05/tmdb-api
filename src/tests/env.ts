import 'dotenv/config';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
	throw new Error('missing api key');
}

const env: { TMDB_API_KEY: string } = { TMDB_API_KEY };

export { env };
