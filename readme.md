# tmdb-api

## Overview

A more convenient way to interact with the most common tmdb endpoints.

## Features
 - Typed responses
 - A built-in rate limiter to avoid errors

## Prereqs

An api key from [TMDB](https://www.themoviedb.org).

## Getting Started

1. Add the api key to your env
2. Grab the library 
   ```
   npm i @ehicks05/tmdb-api
   ```
3. Create and export the client:
   ```ts
   // ./src/tmdb.ts
   import { TmdbApi } from '@ehicks05/tmdb-api';

   const api_key = process.env.TMDB_API_KEY;
   export const tmdb = new TmdbApi({ api_key });
   ```
4. Use it:
   ```ts
   // ./src/demo.ts
   import { tmdb } from './tmdb'

   async function printTitle() {
      const movie = await tmdb.getMovie(603);
      console.log(movie.title); // The Matrix
   }

   printTitle();
   ```

## Notes

1. [TMDB rate limit info](https://developer.themoviedb.org/docs/rate-limiting)
2. TMDB's `/discover` endpoints (maybe all paginated endpoints?) are limited to 500 pages. So you'll have to use filters to bring the results under the limit to be able to see all results.
