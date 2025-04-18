import type { Interval } from 'date-fns';
import {
	type ThrottledClient,
	type ThrottledClientParams,
	getClient,
} from './client/client.js';
import { type Resource, getRecentlyChangedIds } from './endpoints/changes.js';
import { discoverMediaIds } from './endpoints/discover.js';
import { getGenres } from './endpoints/genres.js';
import { getMovie as getMovie2 } from './endpoints/movie.js';
import { getShow as getShow2 } from './endpoints/show.js';
import {
	getLanguages,
	getMovie,
	getPerson,
	getProviders,
	getSeason,
	getShow,
} from './endpoints/simple_endpoints.js';
import { asyncWrapper } from './endpoints/utils.js';

export class TmdbApi {
	private client: ThrottledClient | null = null;

	constructor(params: ThrottledClientParams) {
		if (!this.client) this.client = getClient(params);
	}

	getMovie = asyncWrapper(async (id: number) => {
		if (!this.client) return;
		return getMovie(this.client, id);
	});
	getShow = asyncWrapper(async (id: number) => {
		if (!this.client) return;
		return getShow(this.client, id);
	});
	getPerson = asyncWrapper(async (id: number) => {
		if (!this.client) return;
		return getPerson(this.client, id);
	});
	getSeason = asyncWrapper(async (showId: number, seasonId: number) => {
		if (!this.client) return;
		return getSeason(this.client, showId, seasonId);
	});
	getGenres = asyncWrapper(async () => {
		if (!this.client) return;
		return getGenres(this.client);
	});
	getLanguages = asyncWrapper(async () => {
		if (!this.client) return;
		return getLanguages(this.client);
	});
	getProviders = asyncWrapper(async () => {
		if (!this.client) return;
		return getProviders(this.client);
	});
	getRecentlyChangedIds = asyncWrapper(
		async (resource: Resource, interval?: Interval) => {
			if (!this.client) return;
			return getRecentlyChangedIds(this.client, resource, interval);
		},
	);
	discoverMediaIds = asyncWrapper(
		async (media: 'movie' | 'tv', isFullMode = false) => {
			if (!this.client) return;
			return discoverMediaIds(this.client, media, isFullMode);
		},
	);
}

export class TmdbApi2 {
	constructor(params: ThrottledClientParams) {
		getClient(params);
	}

	getMovie = getMovie2;
	getShow = getShow2;
}
