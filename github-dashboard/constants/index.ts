/**
 * Static constants for the GitHub dashboard module.
 * Env-derived configuration lives in `./env.ts`; this file holds
 * compile-time constants only (endpoints, limits, cache keys).
 */

/** GitHub REST API base. All REST calls are relative to this. */
export const GITHUB_REST_BASE = 'https://api.github.com';

/** GitHub GraphQL endpoint (used for the contribution calendar). */
export const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

/**
 * API version header value pinned per GitHub's REST versioning scheme.
 * @see https://docs.github.com/rest/overview/api-versions
 */
export const GITHUB_API_VERSION = '2022-11-28';

/** User-Agent GitHub requires on every request. */
export const GITHUB_USER_AGENT = 'portfolio-github-dashboard';

/** Max page size GitHub allows for paginated REST endpoints. */
export const MAX_PER_PAGE = 100;

/**
 * Hard ceiling on paginated pages we will walk for any single resource,
 * so a runaway account can never spin the fetch loop forever.
 */
export const MAX_PAGES = 10;

/** Retry policy for transient failures / rate limits. */
export const RETRY = {
  /** Total attempts (1 initial + retries). */
  maxAttempts: 4,
  /** Base delay in ms for exponential backoff. */
  baseDelayMs: 500,
  /** Ceiling for a single backoff wait, in ms. */
  maxDelayMs: 8_000,
  /** Random jitter added to each backoff, in ms. */
  jitterMs: 250,
} as const;

/** Recognised refresh cadences, mapped to seconds. */
export const REFRESH_INTERVALS = {
  hourly: 60 * 60,
  '6h': 6 * 60 * 60,
  '12h': 12 * 60 * 60,
  daily: 24 * 60 * 60,
} as const;

export type RefreshIntervalKey = keyof typeof REFRESH_INTERVALS;

/** Default cadence when the env value is missing or unrecognised. */
export const DEFAULT_REFRESH_INTERVAL: RefreshIntervalKey = '6h';

/** Which of the two configured accounts a piece of data originated from. */
export const ACCOUNT_KEYS = ['primary', 'secondary'] as const;
export type AccountKey = (typeof ACCOUNT_KEYS)[number];

/** Namespaced cache keys, so a future Redis migration stays collision-free. */
export const CACHE_KEYS = {
  dashboard: 'github-dashboard:merged',
  account: (key: AccountKey) => `github-dashboard:account:${key}`,
} as const;

/** Number of days GitHub's contribution calendar spans (rolling year). */
export const CONTRIBUTION_CALENDAR_DAYS = 371; // 53 weeks * 7
