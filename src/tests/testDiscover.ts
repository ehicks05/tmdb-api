import 'dotenv/config';
import { tmdb } from './client.js';

const ids = await tmdb.discoverMediaIds('tv', true);

console.log(ids);
