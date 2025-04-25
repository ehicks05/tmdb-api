const { VITE_TMDB_API_KEY } = process.env;

if (!VITE_TMDB_API_KEY) {
	throw new Error('missing api key');
}

const env: { TMDB_API_KEY: string } = { TMDB_API_KEY: VITE_TMDB_API_KEY };

export { env };
