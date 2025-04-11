import { tmdb } from '../tmdb/index.js';

const reportTmdbLatency = async (movieId = 603) => {
	// warm
	await tmdb.getMovie(movieId);
	await tmdb.getMovie(movieId);
	await tmdb.getMovie(movieId);
	// measure
	const start = Date.now();
	await tmdb.getMovie(movieId);
	await tmdb.getMovie(movieId);
	await tmdb.getMovie(movieId);
	const end = Date.now();
	const dur = Math.round((end - start) / 3);
	console.log(`tmdb latency: ${dur} ms`);
};
