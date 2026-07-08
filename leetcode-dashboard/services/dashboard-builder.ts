import 'server-only';

/**
 * Assembles the merged {@link LeetcodeDashboard} from the individual services,
 * caching each section under its own `username + queryType` key so a section
 * failing or being unavailable never blanks the rest.
 *
 * Profile and problem-stats share one GraphQL query (PROFILE_QUERY), so they're
 * produced from a single fetch here rather than two round-trips.
 */

import { CACHE_KEYS } from '../constants';
import { readThrough } from '../cache';
import { classifyError } from '../lib/errors';
import type {
  ContestData,
  DashboardMeta,
  LeetcodeDashboard,
  LeetcodeProfile,
  ProblemStats,
  RecentSubmission,
  ServiceResult,
  SubmissionCalendar,
  TopicStats,
} from '../types';
import { ServiceResult as R } from '../types/result';
import type { RawProfileResponse } from '../types/raw';
import { LeetcodeService } from './leetcode-service';
import { LeetcodeHttpClient } from './http-client';
import { PROFILE_QUERY } from './queries';
import { normalizeProblemStats, normalizeProfile } from './normalize';

/** Profile + problem-stats from a single PROFILE_QUERY round-trip. */
async function fetchProfileAndStats(
  username: string,
  revalidateSeconds: number,
): Promise<{
  profile: ServiceResult<LeetcodeProfile>;
  problemStats: ServiceResult<ProblemStats>;
}> {
  const client = new LeetcodeHttpClient({ revalidateSeconds });
  try {
    const data = await client.query<RawProfileResponse>(PROFILE_QUERY, {
      username,
    });
    if (!data.matchedUser) {
      const fail = R.fail<never>('User not found');
      return { profile: fail, problemStats: fail };
    }
    return {
      profile: R.ok(normalizeProfile(data.matchedUser)),
      problemStats: R.ok(
        normalizeProblemStats(
          data.matchedUser.submitStatsGlobal.acSubmissionNum,
          data.allQuestionsCount ?? [],
        ),
      ),
    };
  } catch (err) {
    const message = classifyError(err).message;
    return { profile: R.fail(message), problemStats: R.fail(message) };
  }
}

/** A section either loaded, failed, or is unavailable — summarised for meta. */
function classifySection(key: string, result: ServiceResult<unknown>) {
  return {
    key,
    failed: result.error !== null,
    unavailable: result.unavailable,
  };
}

/**
 * Builds the full merged dashboard for a username. Each section is cached under
 * its own key with the given TTL, so a partial refresh reuses fresh sections.
 * Never throws — every failure rides inside a section's `ServiceResult`.
 */
export async function buildDashboard(
  username: string,
  revalidateSeconds: number,
): Promise<LeetcodeDashboard> {
  const user = username.toLowerCase();
  const service = new LeetcodeService({ revalidateSeconds });

  const [
    profileStats,
    calendar,
    contest,
    recent,
    topics,
  ] = await Promise.all([
    readThrough(
      CACHE_KEYS.profile(user),
      revalidateSeconds,
      () => fetchProfileAndStats(username, revalidateSeconds),
    ).then((r) => r.value),
    readThrough(
      CACHE_KEYS.calendar(user),
      revalidateSeconds,
      () => service.fetchSubmissionCalendar(username),
    ).then((r) => r.value as ServiceResult<SubmissionCalendar>),
    readThrough(
      CACHE_KEYS.contest(user),
      revalidateSeconds,
      () => service.fetchContestData(username),
    ).then((r) => r.value as ServiceResult<ContestData>),
    readThrough(
      CACHE_KEYS.recent(user),
      revalidateSeconds,
      () => service.fetchRecentActivity(username),
    ).then((r) => r.value as ServiceResult<RecentSubmission[]>),
    readThrough(
      CACHE_KEYS.topics(user),
      revalidateSeconds,
      () => service.fetchTopicStats(username),
    ).then((r) => r.value as ServiceResult<TopicStats>),
  ]);

  const sections = [
    classifySection('profile', profileStats.profile),
    classifySection('problemStats', profileStats.problemStats),
    classifySection('calendar', calendar),
    classifySection('contest', contest),
    classifySection('recent', recent),
    classifySection('topics', topics),
  ];

  const meta: DashboardMeta = {
    generatedAt: new Date().toISOString(),
    partial: sections.some((s) => s.failed),
    failedSections: sections.filter((s) => s.failed).map((s) => s.key),
    unavailableSections: sections
      .filter((s) => s.unavailable)
      .map((s) => s.key),
    refreshIntervalSeconds: revalidateSeconds,
  };

  return {
    username,
    profile: profileStats.profile,
    problemStats: profileStats.problemStats,
    calendar,
    contest,
    recent,
    topics,
    meta,
  };
}
