/**
 * Static constants for the LeetCode dashboard module.
 *
 * Env-derived configuration lives in `./env.ts`; this file holds compile-time
 * constants only (endpoint, difficulty colours, cache keys, limits). Mirrors
 * the sibling `github-dashboard/constants` for consistency.
 */

/** LeetCode's public GraphQL endpoint. No auth / cookies / CSRF required. */
export const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';

/**
 * A Referer header LeetCode expects on public GraphQL calls. Sending it makes
 * responses reliable; omitting it occasionally trips a bot filter.
 */
export const LEETCODE_REFERER = 'https://leetcode.com';

/** User-Agent sent on every request (a browser-like UA is the safest choice). */
export const LEETCODE_USER_AGENT =
  'Mozilla/5.0 (compatible; portfolio-leetcode-dashboard/1.0)';

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

/** Default cap on recent accepted submissions we request. */
export const RECENT_SUBMISSIONS_LIMIT = 20;

/**
 * Difficulty levels as LeetCode labels them in `acSubmissionNum`. `All` is the
 * aggregate row; the three real buckets are Easy/Medium/Hard.
 */
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const;
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

/** The aggregate row label LeetCode returns alongside the real buckets. */
export const DIFFICULTY_ALL = 'All' as const;

/**
 * Canonical difficulty colours for every chart/legend in the UI phase, so the
 * whole dashboard reads as one system. These are LeetCode's own accent hues.
 */
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: '#00b8a3',
  Medium: '#ffc01e',
  Hard: '#ff375f',
} as const;

/**
 * Default refresh cadence in seconds when the env value is missing or invalid.
 * 21600 = 6 hours. Matches LEETCODE_REFRESH_INTERVAL's default.
 */
export const DEFAULT_REFRESH_INTERVAL_SECONDS = 21_600;

/**
 * Sane bounds for a configured refresh interval. Anything outside this range is
 * clamped so a typo can neither hammer LeetCode nor freeze the data for months.
 */
export const MIN_REFRESH_INTERVAL_SECONDS = 5 * 60; // 5 minutes
export const MAX_REFRESH_INTERVAL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Namespaced cache keys, keyed by username + query type, so a future Redis
 * migration stays collision-free. Username is lower-cased by callers.
 */
export const CACHE_KEYS = {
  profile: (username: string) => `leetcode-dashboard:${username}:profile`,
  problemStats: (username: string) =>
    `leetcode-dashboard:${username}:problem-stats`,
  calendar: (username: string) => `leetcode-dashboard:${username}:calendar`,
  contest: (username: string) => `leetcode-dashboard:${username}:contest`,
  recent: (username: string) => `leetcode-dashboard:${username}:recent`,
  topics: (username: string) => `leetcode-dashboard:${username}:topics`,
  dashboard: (username: string) => `leetcode-dashboard:${username}:dashboard`,
} as const;

/** Query-type discriminator, used for cache keys and telemetry. */
export const QUERY_TYPES = [
  'profile',
  'problemStats',
  'calendar',
  'contest',
  'recent',
  'topics',
] as const;
export type QueryType = (typeof QUERY_TYPES)[number];
