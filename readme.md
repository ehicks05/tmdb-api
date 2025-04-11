# tmdb-api

## Overview

A more convenient way to interact with the most common tmdb endpoints.

## Features
 - Typed responses
 - A built-in rate limiter to avoid 429 errors

## Getting Started

1. grab an api key from tmdb and make it available in your env
2. `npm i tmdb-api`
2. ...
2. run:
   ```
   todo
   asdf
   ```

## Notes

1. [TMDB rate limit info](https://developer.themoviedb.org/docs/rate-limiting)
2. TMDB's `/discover` endpoints (maybe all paginated endpoints?) are limited to 500 pages. So you'll have to use filters to bring the results under the limit to be able to see all results.
