/**
 * Service return wrappers, error classification, and the merged dashboard
 * contract — the shapes the API and UI phases consume.
 */

import type {
  ContestData,
  LeetcodeProfile,
  ProblemStats,
  RecentSubmission,
  SubmissionCalendar,
  TopicStats,
} from './models';

/** Coarse error classification for UI/telemetry. */
export type LeetcodeErrorKind =
  | 'not-found' // user does not exist
  | 'rate-limit' // 429 / throttled by LeetCode
  | 'network' // fetch failed / 5xx
  | 'malformed' // response shape failed validation
  | 'unknown';

/**
 * The wrapper EVERY service returns. The data layer never throws to callers —
 * failures ride in `error`, and the "publicly available but empty for this
 * user" case (e.g. contest data for a non-competitor) rides in `unavailable`.
 *
 * Invariants:
 *  - `unavailable: true`  => `data` is null and `error` is null (not a failure,
 *    just genuinely no public data for this user).
 *  - `error !== null`     => `data` is null and `unavailable` is false.
 *  - `data !== null`      => `error` is null and `unavailable` is false.
 */
export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  /** True when the datapoint is public but this user simply has none of it. */
  unavailable: boolean;
}

/** Convenience constructors keep the invariants above in one place. */
export const ServiceResult = {
  ok<T>(data: T): ServiceResult<T> {
    return { data, error: null, unavailable: false };
  },
  fail<T>(error: string): ServiceResult<T> {
    return { data: null, error, unavailable: false };
  },
  unavailable<T>(): ServiceResult<T> {
    return { data: null, error: null, unavailable: true };
  },
} as const;

/**
 * The complete merged dashboard payload the UI phase renders. Each section is a
 * `ServiceResult`, so one section failing or being unavailable never blanks the
 * rest — the UI renders what loaded and shows a graceful state for the rest.
 */
export interface LeetcodeDashboard {
  username: string;
  profile: ServiceResult<LeetcodeProfile>;
  problemStats: ServiceResult<ProblemStats>;
  calendar: ServiceResult<SubmissionCalendar>;
  contest: ServiceResult<ContestData>;
  recent: ServiceResult<RecentSubmission[]>;
  topics: ServiceResult<TopicStats>;
  meta: DashboardMeta;
}

/** Provenance & freshness metadata for a dashboard snapshot. */
export interface DashboardMeta {
  /** ISO-8601 timestamp when this snapshot was assembled. */
  generatedAt: string;
  /** True when at least one section failed to load (vs. merely unavailable). */
  partial: boolean;
  /** Section keys that hard-failed (error, not unavailable). */
  failedSections: string[];
  /** Section keys that are unavailable for this user (no public data). */
  unavailableSections: string[];
  /** Seconds until the next scheduled refresh. */
  refreshIntervalSeconds: number;
}

/**
 * Discriminated result the top-level dashboard API returns. Unlike individual
 * sections, the whole dashboard only fails outright when the user can't be
 * resolved at all (not configured / user not found) — otherwise it's `ok` with
 * per-section results, possibly `stale` if served from an expired cache.
 */
export type DashboardResult =
  | { ok: true; data: LeetcodeDashboard; stale: boolean }
  | { ok: false; error: string; kind: LeetcodeErrorKind; data: null };
