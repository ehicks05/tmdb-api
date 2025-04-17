import pMap from 'p-map';
import { expect, test } from 'vitest';
import { TmdbApi } from '../main.js';
import { env } from './env.js';

const TMDB_RPS_LIMIT = 40;
const TEST_REQUEST_COUNT = 80;
const TEST_PERSON_ID = 31;

test('rateLimit', { timeout: 10_000, concurrent: false }, async () => {
	const zeroArray = new Array(TEST_REQUEST_COUNT).fill(0);

	const client1 = new TmdbApi({ api_key: env.TMDB_API_KEY });
	const client2 = new TmdbApi({ api_key: env.TMDB_API_KEY });

	const start = Date.now();

	await Promise.all([
		await pMap(zeroArray, () => client1.getPerson(TEST_PERSON_ID)),
		await pMap(zeroArray, () => client2.getPerson(TEST_PERSON_ID)),
	]);
	const end = Date.now();

	const requests = TEST_REQUEST_COUNT * 2; // two clients
	const duration = end - start + 1000; // +1 second to start with a full bucket
	const rps = (requests / duration) * 1000;

	expect(rps).toBeLessThanOrEqual(TMDB_RPS_LIMIT);
});
