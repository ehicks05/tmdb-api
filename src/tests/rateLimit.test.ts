import pMap from 'p-map';
import { expect, test } from 'vitest';
import { tmdb } from './client.js';

const TMDB_RPS_LIMIT = 40;
const TEST_REQUEST_COUNT = 120;
const TEST_PERSON_ID = 31;

test('rateLimit', { timeout: 10_000 }, async () => {
	const requests = new Array(TEST_REQUEST_COUNT).fill(0);

	const start = Date.now();
	await pMap(requests, () => tmdb.getPerson(TEST_PERSON_ID));
	const end = Date.now();

	const rps = TEST_REQUEST_COUNT / (end - start) / 1000;

	expect(rps).toBeLessThanOrEqual(TMDB_RPS_LIMIT + 1);
});
