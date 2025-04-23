import { expect, test } from 'vitest';
import { tmdb } from '../tests/client.js';

const pages = 2;

test('get popular people', async () => {
	const popularPeople = await tmdb.popular({ resource: 'person', pages });
	const p0 = popularPeople?.[0];
	const p39 = popularPeople?.[39];

	expect(popularPeople).length(pages * 20);
	expect(p0).toBeDefined();
	expect(p39).toBeDefined();
	if (p0 && p39) {
		expect(p0.popularity).greaterThanOrEqual(p39.popularity);
	}
});
