/**
 * Merged & aggregated shapes — the unified developer identity.
 *
 * This is the contract the UI phase consumes. Every field here represents
 * BOTH accounts combined into a single value.
 */

import type {
  ActivityEvent,
  ContributionCalendar,
  FollowerRef,
  Organization,
  Repository,
} from './github';

/** A language's aggregate footprint across all repos of both accounts. */
export interface LanguageStat {
  name: string;
  bytes: number;
  /** Share of total bytes, 0-100, rounded to 1 decimal. */
  percentage: number;
  /** Number of repos where this is the primary language. */
  repoCount: number;
}

/** Commit totals bucketed by calendar granularity, derived from the calendar. */
export interface CommitAggregate {
  daily: TimeBucket[];
  weekly: TimeBucket[];
  monthly: TimeBucket[];
  yearly: TimeBucket[];
}

/** A single labelled time bucket with a summed count. */
export interface TimeBucket {
  /** Bucket key: "YYYY-MM-DD" | "YYYY-Www" | "YYYY-MM" | "YYYY". */
  key: string;
  label: string;
  count: number;
}

/** Longest/current contribution streaks over the merged calendar. */
export interface StreakStat {
  currentStreakDays: number;
  currentStreakStart: string | null;
  longestStreakDays: number;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
}

/** The single most active day and month across the merged calendar. */
export interface ActivityPeaks {
  mostActiveDay: { date: string; count: number } | null;
  mostActiveMonth: { key: string; label: string; count: number } | null;
  /** Contributions summed by weekday, index 0=Sunday .. 6=Saturday. */
  byWeekday: number[];
}

/** Top-line combined statistics for the whole identity. */
export interface MergedStatistics {
  totalRepositories: number;
  /** Repos visible in `MergedDashboard.repositories` (never includes private repos). */
  publicRepositories: number;
  /** Count only — no private repo names/details are ever exposed. */
  privateRepositories: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  totalOpenIssues: number;
  totalContributions: number;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalReviews: number;
  totalFollowers: number;
  totalFollowing: number;
  totalOrganizations: number;
  languageCount: number;
  /** Earliest account creation date across both accounts (ISO-8601). */
  memberSince: string;
}

/** Ready-to-render heatmap cell (merged calendar). */
export interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  /** Column index (week) in the heatmap grid. */
  week: number;
  /** Row index (0=Sunday .. 6=Saturday). */
  weekday: number;
}

/** Full heatmap grid + legend thresholds for the merged calendar. */
export interface Heatmap {
  cells: HeatmapCell[];
  weeks: number;
  /** Inclusive lower bounds for levels 1..4 (level 0 is always count 0). */
  thresholds: [number, number, number, number];
  maxCount: number;
}

/**
 * The complete merged dashboard payload the UI phase renders.
 * `partial`/`errors` express resilience: data can be present even when
 * one account failed to load.
 */
export interface MergedDashboard {
  statistics: MergedStatistics;
  /**
   * PUBLIC REPOS ONLY. Private repos are never included here — not their
   * name, not their URL, nothing identifying — only their aggregate counts
   * surface, via `statistics.privateRepositories`. See `lib/combine.ts`.
   */
  repositories: Repository[];
  languages: LanguageStat[];
  contributionCalendar: ContributionCalendar;
  commitAggregate: CommitAggregate;
  streaks: StreakStat;
  peaks: ActivityPeaks;
  heatmap: Heatmap;
  events: ActivityEvent[];
  organizations: Organization[];
  followers: FollowerRef[];
  /** Provenance & freshness metadata. */
  meta: DashboardMeta;
}

/** Which accounts contributed, when it was built, and any failures. */
export interface DashboardMeta {
  /** ISO-8601 timestamp when this snapshot was assembled. */
  generatedAt: string;
  /** Accounts that loaded successfully. */
  accountsLoaded: string[];
  /** True when at least one configured account failed. */
  partial: boolean;
  errors: AccountError[];
  /** Seconds until the next scheduled refresh. */
  refreshIntervalSeconds: number;
}

/** A per-account failure surfaced (not thrown) to the caller. */
export interface AccountError {
  account: string;
  message: string;
  /** Coarse classification for UI/telemetry. */
  kind: 'auth' | 'rate-limit' | 'not-found' | 'network' | 'unknown';
}

/**
 * Discriminated result wrapper the service returns.
 * The data layer NEVER throws to the UI — failures ride here.
 */
export type DashboardResult =
  | { ok: true; data: MergedDashboard; stale: boolean }
  | { ok: false; error: AccountError; data: null };
