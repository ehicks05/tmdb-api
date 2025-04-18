import { type ThrottledClientParams, getClient } from './client/client.js';
import { changes } from './endpoints/changes.js';
import { discover } from './endpoints/discover.js';
import { getGenres } from './endpoints/genres.js';
import { getLanguages } from './endpoints/languages.js';
import { getMovie } from './endpoints/movie.js';
import { getPerson } from './endpoints/person.js';
import { getProviders } from './endpoints/providers.js';
import { getSeason } from './endpoints/season.js';
import { getShow } from './endpoints/show.js';

export class TmdbApi {
	constructor(params: ThrottledClientParams) {
		getClient(params);
	}

	changes = changes;
	discover = discover;
	genres = getGenres;
	languages = getLanguages;
	movie = getMovie;
	person = getPerson;
	providers = getProviders;
	season = getSeason;
	show = getShow;
}
