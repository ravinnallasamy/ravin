/**
 * Normalised, UI-ready data models.
 *
 * These are the clean, stable shapes the rest of the module (utils, api, and
 * the future UI phase) consumes. The service layer maps every `Raw*` payload
 * into these, so nothing downstream depends on LeetCode's wire format.
 */

import type { Difficulty } from '../constants';

/** A user's public profile & identity. */
export interface LeetcodeProfile {
  username: string;
  realName: string | null;
  avatarUrl: string | null;
  /** Global rank (lower is better); null when LeetCode omits it. */
  ranking: number | null;
  reputation: number | null;
  country: string | null;
  aboutMe: string | null;
  school: string | null;
  websites: string[];
  skillTags: string[];
  postViewCount: number | null;
  /** Social links LeetCode exposes on the profile. */
  githubUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
}

/** Solved vs. available counts for a single difficulty bucket. */
export interface DifficultyStat {
  difficulty: Difficulty;
  /** Distinct problems solved at this difficulty. */
  solved: number;
  /** Total problems available at this difficulty on the platform. */
  total: number;
  /** Total accepted submissions at this difficulty (>= solved). */
  submissions: number;
  /** solved/total * 100, 0-100 rounded to 1 decimal. 0 when total is 0. */
  percentage: number;
}

/** Problem-solving statistics across all difficulties. */
export interface ProblemStats {
  totalSolved: number;
  totalAvailable: number;
  /** totalSolved/totalAvailable * 100, 0-100 rounded to 1 decimal. */
  overallPercentage: number;
  /** Always ordered Easy, Medium, Hard. */
  byDifficulty: DifficultyStat[];
}

/** A single day of submission activity, from the parsed calendar. */
export interface SubmissionDay {
  /** ISO date "YYYY-MM-DD" (UTC). */
  date: string;
  /** Unix seconds (day start, UTC) — the raw calendar key. */
  timestamp: number;
  /** Submissions made that day. */
  count: number;
}

/** The parsed submission calendar (heatmap source data). */
export interface SubmissionCalendar {
  /** Chronologically ordered days that had at least one submission. */
  days: SubmissionDay[];
  /** Years the user has any activity in. */
  activeYears: number[];
  /** LeetCode's reported current streak (days). */
  streak: number;
  /** Distinct days with activity across the reported window. */
  totalActiveDays: number;
  /** Sum of all daily submission counts. */
  totalSubmissions: number;
}

/** Aggregate contest standing. */
export interface ContestRanking {
  attendedContestsCount: number;
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  /** Top percentile (lower is better), as LeetCode reports it. */
  topPercentage: number;
}

/** One attended contest, normalised from the ranking history. */
export interface ContestHistoryEntry {
  title: string;
  /** ISO-8601 start time. */
  startTime: string;
  /** Unix seconds start time — kept for trend/sort math. */
  startTimestamp: number;
  rating: number;
  ranking: number;
  problemsSolved: number;
  totalProblems: number;
  trendDirection: string | null;
}

/** Full contest picture: current standing + attended history + derived peak. */
export interface ContestData {
  ranking: ContestRanking;
  /** Only contests the user actually attended, oldest-first. */
  history: ContestHistoryEntry[];
  /** Highest rating ever reached across history (or current if history empty). */
  highestRating: number;
}

/** A recently accepted problem. */
export interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  /** Direct link to the problem. */
  url: string;
  /** Unix seconds. */
  timestamp: number;
  /** ISO-8601 timestamp. */
  date: string;
}

/** Mastery bucket a topic tag belongs to. */
export type TopicLevel = 'fundamental' | 'intermediate' | 'advanced';

/** Problems solved for a single topic tag. */
export interface TopicStat {
  name: string;
  slug: string;
  level: TopicLevel;
  problemsSolved: number;
}

/** Topic-tag statistics grouped and flattened. */
export interface TopicStats {
  /** All tags across every level, sorted by problemsSolved desc. */
  all: TopicStat[];
  fundamental: TopicStat[];
  intermediate: TopicStat[];
  advanced: TopicStat[];
  /** Total distinct-tag solve credits (sum of problemsSolved across tags). */
  totalTagSolves: number;
}
