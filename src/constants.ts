export const LIMIT = 40;
export const INTERVAL_MS = 1000;
const RPS = (LIMIT / INTERVAL_MS) * 1000;
/**
 * pThrottle throttles to `LIMIT` executions per `INTERVAL_MS` ms.
 * `RPS` included for convenience.
 */
export const TMDB_RATE_LIMIT = { LIMIT, INTERVAL_MS, RPS };

/**
 * Paginated endpoints fail when page > 500
 */
export const TMDB_PAGE_LIMIT = 500;
