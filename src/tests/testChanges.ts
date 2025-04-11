import { subDays } from 'date-fns';
import 'dotenv/config';
import { tmdb } from './client.js';

const ids = await tmdb.getRecentlyChangedIds('person', {
	start: subDays(new Date(), 7),
	end: new Date(),
});
