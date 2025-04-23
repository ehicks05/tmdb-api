import { type ThrottledClientParams, getClient } from './client/client.js';
import { certifications } from './endpoints/certifications.js';
import { changes } from './endpoints/changes.js';
import { company } from './endpoints/company.js';
import { discover } from './endpoints/discover.js';
import { genres } from './endpoints/genres.js';
import { languages } from './endpoints/languages.js';
import { movie } from './endpoints/movie.js';
import { person } from './endpoints/person.js';
import { popular } from './endpoints/popular.js';
import { providers } from './endpoints/providers.js';
import { season } from './endpoints/season.js';
import { show } from './endpoints/show.js';

export class TmdbApi {
	constructor(params: ThrottledClientParams) {
		getClient(params);
	}

	certifications = certifications;
	changes = changes;
	company = company;
	discover = discover;
	genres = genres;
	languages = languages;
	movie = movie;
	person = person;
	popular = popular;
	providers = providers;
	season = season;
	show = show;
}
