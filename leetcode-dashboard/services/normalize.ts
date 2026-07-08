import 'server-only';

/**
 * Maps raw LeetCode GraphQL payloads into the module's normalised models.
 * Kept separate from fetching so the wire format is isolated to one place.
 * Every function validates the shape it needs and returns a clean model (or
 * throws {@link LeetcodeDashboardError} on a malformed payload, which the
 * service converts to a `ServiceResult.fail`).
 */

import { DIFFICULTY_LEVELS, DIFFICULTY_ALL, type Difficulty } from '../constants';
import { LeetcodeDashboardError } from '../lib/errors';
import { pct } from '../utils/math';
import { unixToIso } from '../utils/date';
import type {
  ContestData,
  ContestHistoryEntry,
  DifficultyStat,
  LeetcodeProfile,
  ProblemStats,
  RecentSubmission,
  SubmissionCalendar,
  SubmissionDay,
  TopicLevel,
  TopicStat,
  TopicStats,
} from '../types/models';
import type {
  RawAcSubmissionNum,
  RawAllQuestionsCount,
  RawMatchedUser,
  RawRecentSubmission,
  RawTagProblemCount,
  RawTagProblemCounts,
  RawUserCalendar,
  RawUserContestRanking,
  RawUserContestRankingHistoryEntry,
} from '../types/raw';

/* --------------------------------- profile -------------------------------- */

export function normalizeProfile(raw: RawMatchedUser): LeetcodeProfile {
  const p = raw.profile;
  return {
    username: raw.username,
    realName: p.realName || null,
    avatarUrl: p.userAvatar || null,
    ranking: p.ranking ?? null,
    reputation: p.reputation ?? null,
    country: p.countryName || null,
    aboutMe: p.aboutMe || null,
    school: p.school || null,
    websites: p.websites ?? [],
    skillTags: p.skillTags ?? [],
    postViewCount: p.postViewCount ?? null,
    githubUrl: raw.githubUrl || null,
    twitterUrl: raw.twitterUrl || null,
    linkedinUrl: raw.linkedinUrl || null,
  };
}

/* ------------------------------ problem stats ----------------------------- */

/** Builds a `difficulty -> row` map, preserving the row's element type. */
function indexByDifficulty<T extends { difficulty: string }>(
  rows: readonly T[],
): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) map.set(row.difficulty, row);
  return map;
}

export function normalizeProblemStats(
  acSubmissionNum: RawAcSubmissionNum[],
  allQuestionsCount: RawAllQuestionsCount[],
): ProblemStats {
  const solvedByDiff = indexByDifficulty(acSubmissionNum);
  const totalByDiff = indexByDifficulty(allQuestionsCount);

  const byDifficulty: DifficultyStat[] = DIFFICULTY_LEVELS.map(
    (difficulty: Difficulty): DifficultyStat => {
      const solvedRow = solvedByDiff.get(difficulty);
      const totalRow = totalByDiff.get(difficulty);
      const solved = solvedRow?.count ?? 0;
      const total = totalRow?.count ?? 0;
      return {
        difficulty,
        solved,
        total,
        submissions: solvedRow?.submissions ?? 0,
        percentage: pct(solved, total),
      };
    },
  );

  const allSolved = solvedByDiff.get(DIFFICULTY_ALL)?.count;
  const allTotal = totalByDiff.get(DIFFICULTY_ALL)?.count;

  // Prefer the platform's "All" aggregate; fall back to summing the buckets so
  // a missing aggregate row never zeroes the headline number.
  const totalSolved =
    allSolved ?? byDifficulty.reduce((s, d) => s + d.solved, 0);
  const totalAvailable =
    allTotal ?? byDifficulty.reduce((s, d) => s + d.total, 0);

  return {
    totalSolved,
    totalAvailable,
    overallPercentage: pct(totalSolved, totalAvailable),
    byDifficulty,
  };
}

/* -------------------------------- calendar -------------------------------- */

/**
 * Parses `submissionCalendar` — a JSON **string** of `{"<unixSeconds>":count}`.
 * Returns a normalised, chronologically ordered calendar. A malformed JSON
 * string throws so the service can classify it, rather than silently emptying.
 */
export function normalizeCalendar(raw: RawUserCalendar): SubmissionCalendar {
  let parsed: Record<string, number> = {};
  if (raw.submissionCalendar) {
    try {
      const obj = JSON.parse(raw.submissionCalendar) as unknown;
      if (obj && typeof obj === 'object') {
        parsed = obj as Record<string, number>;
      }
    } catch {
      throw new LeetcodeDashboardError(
        'malformed',
        'submissionCalendar was not valid JSON',
      );
    }
  }

  const days: SubmissionDay[] = Object.entries(parsed)
    .map(([ts, count]): SubmissionDay => {
      const timestamp = Number(ts);
      return {
        timestamp,
        date: unixToIso(timestamp).slice(0, 10),
        count: Number(count) || 0,
      };
    })
    .filter((d) => Number.isFinite(d.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);

  const totalSubmissions = days.reduce((sum, d) => sum + d.count, 0);

  return {
    days,
    activeYears: raw.activeYears ?? [],
    streak: raw.streak ?? 0,
    totalActiveDays: raw.totalActiveDays ?? days.length,
    totalSubmissions,
  };
}

/* --------------------------------- contest -------------------------------- */

function normalizeContestHistoryEntry(
  raw: RawUserContestRankingHistoryEntry,
): ContestHistoryEntry {
  return {
    title: raw.contest.title,
    startTimestamp: raw.contest.startTime,
    startTime: unixToIso(raw.contest.startTime),
    rating: raw.rating,
    ranking: raw.ranking,
    problemsSolved: raw.problemsSolved,
    totalProblems: raw.totalProblems,
    trendDirection: raw.trendDirection ?? null,
  };
}

/**
 * Normalises contest data. Returns null when the user never competed (ranking
 * absent AND no attended history) — the service maps that null to `unavailable`.
 */
export function normalizeContest(
  ranking: RawUserContestRanking | null,
  history: RawUserContestRankingHistoryEntry[] | null,
): ContestData | null {
  const attended = (history ?? [])
    .filter((h) => h.attended)
    .map(normalizeContestHistoryEntry)
    .sort((a, b) => a.startTimestamp - b.startTimestamp);

  if (!ranking && attended.length === 0) return null;

  const ratings = attended.map((h) => h.rating);
  const highestRating = ratings.length
    ? Math.max(...ratings, ranking?.rating ?? -Infinity)
    : ranking?.rating ?? 0;

  return {
    ranking: {
      attendedContestsCount: ranking?.attendedContestsCount ?? attended.length,
      rating: ranking?.rating ?? attended.at(-1)?.rating ?? 0,
      globalRanking: ranking?.globalRanking ?? 0,
      totalParticipants: ranking?.totalParticipants ?? 0,
      topPercentage: ranking?.topPercentage ?? 0,
    },
    history: attended,
    highestRating,
  };
}

/* --------------------------------- recent --------------------------------- */

export function normalizeRecent(
  raw: RawRecentSubmission[],
): RecentSubmission[] {
  return raw.map((r): RecentSubmission => {
    const timestamp = Number(r.timestamp);
    return {
      id: r.id,
      title: r.title,
      titleSlug: r.titleSlug,
      url: `https://leetcode.com/problems/${r.titleSlug}/`,
      timestamp,
      date: unixToIso(timestamp),
    };
  });
}

/* --------------------------------- topics --------------------------------- */

function normalizeTag(raw: RawTagProblemCount, level: TopicLevel): TopicStat {
  return {
    name: raw.tagName,
    slug: raw.tagSlug,
    level,
    problemsSolved: raw.problemsSolved,
  };
}

/**
 * Normalises topic-tag stats. Returns null when the user has solved nothing in
 * any tag (all buckets empty) → the service maps that to `unavailable`.
 */
export function normalizeTopics(
  raw: RawTagProblemCounts,
): TopicStats | null {
  const fundamental = (raw.fundamental ?? []).map((t) =>
    normalizeTag(t, 'fundamental'),
  );
  const intermediate = (raw.intermediate ?? []).map((t) =>
    normalizeTag(t, 'intermediate'),
  );
  const advanced = (raw.advanced ?? []).map((t) => normalizeTag(t, 'advanced'));

  const all = [...fundamental, ...intermediate, ...advanced].sort(
    (a, b) => b.problemsSolved - a.problemsSolved,
  );

  const totalTagSolves = all.reduce((sum, t) => sum + t.problemsSolved, 0);
  if (all.length === 0 || totalTagSolves === 0) return null;

  return { all, fundamental, intermediate, advanced, totalTagSolves };
}
