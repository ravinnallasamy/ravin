import 'server-only';

/**
 * LeetcodeService — the ONLY entry point the rest of the app uses to obtain
 * LeetCode data. No UI or route ever calls LeetCode directly.
 *
 * Each `fetch*` method:
 *  - accepts a username parameter (never hardcoded),
 *  - runs its query through {@link LeetcodeHttpClient},
 *  - validates the response shape before using it,
 *  - normalises into clean typed models,
 *  - returns a {@link ServiceResult} — never throws to the caller.
 *
 * The "publicly available but empty for this user" case (contest data for a
 * non-competitor, topics for someone who solved nothing) returns
 * `ServiceResult.unavailable()`, distinct from a hard failure.
 */

import { RECENT_SUBMISSIONS_LIMIT } from '../constants';
import { classifyError } from '../lib/errors';
import type {
  ContestData,
  LeetcodeProfile,
  ProblemStats,
  RecentSubmission,
  ServiceResult,
  SubmissionCalendar,
  TopicStats,
} from '../types';
import { ServiceResult as R } from '../types/result';
import type {
  RawCalendarResponse,
  RawContestResponse,
  RawProfileResponse,
  RawRecentResponse,
  RawTopicsResponse,
} from '../types/raw';
import { LeetcodeHttpClient } from './http-client';
import {
  CALENDAR_QUERY,
  CONTEST_QUERY,
  PROFILE_QUERY,
  RECENT_QUERY,
  TOPICS_QUERY,
} from './queries';
import {
  normalizeCalendar,
  normalizeContest,
  normalizeProblemStats,
  normalizeProfile,
  normalizeRecent,
  normalizeTopics,
} from './normalize';

export interface ServiceOptions {
  /** ISR revalidate window forwarded to fetch. */
  revalidateSeconds: number;
}

export class LeetcodeService {
  private readonly client: LeetcodeHttpClient;

  constructor(options: ServiceOptions) {
    this.client = new LeetcodeHttpClient({
      revalidateSeconds: options.revalidateSeconds,
    });
  }

  /** Profile: avatar, realName, country, globalRanking, reputation, socials. */
  async fetchProfile(
    username: string,
  ): Promise<ServiceResult<LeetcodeProfile>> {
    try {
      const data = await this.client.query<RawProfileResponse>(PROFILE_QUERY, {
        username,
      });
      if (!data.matchedUser) return R.fail('User not found');
      return R.ok(normalizeProfile(data.matchedUser));
    } catch (err) {
      return R.fail(classifyError(err).message);
    }
  }

  /** Problem stats: total/easy/medium/hard solved + totals available. */
  async fetchProblemStats(
    username: string,
  ): Promise<ServiceResult<ProblemStats>> {
    try {
      const data = await this.client.query<RawProfileResponse>(PROFILE_QUERY, {
        username,
      });
      if (!data.matchedUser) return R.fail('User not found');
      const stats = normalizeProblemStats(
        data.matchedUser.submitStatsGlobal.acSubmissionNum,
        data.allQuestionsCount ?? [],
      );
      return R.ok(stats);
    } catch (err) {
      return R.fail(classifyError(err).message);
    }
  }

  /** Submission calendar (heatmap source), or unavailable if the user has none. */
  async fetchSubmissionCalendar(
    username: string,
  ): Promise<ServiceResult<SubmissionCalendar>> {
    try {
      const data = await this.client.query<RawCalendarResponse>(
        CALENDAR_QUERY,
        { username },
      );
      const raw = data.matchedUser?.userCalendar;
      if (!raw) return R.unavailable();
      const calendar = normalizeCalendar(raw);
      if (calendar.days.length === 0) return R.unavailable();
      return R.ok(calendar);
    } catch (err) {
      return R.fail(classifyError(err).message);
    }
  }

  /** Contest rating/ranking/history, or unavailable for non-competitors. */
  async fetchContestData(
    username: string,
  ): Promise<ServiceResult<ContestData>> {
    try {
      const data = await this.client.query<RawContestResponse>(CONTEST_QUERY, {
        username,
      });
      const contest = normalizeContest(
        data.userContestRanking,
        data.userContestRankingHistory,
      );
      if (!contest) return R.unavailable();
      return R.ok(contest);
    } catch (err) {
      return R.fail(classifyError(err).message);
    }
  }

  /** Recent accepted submissions, or unavailable if the list is empty. */
  async fetchRecentActivity(
    username: string,
    limit: number = RECENT_SUBMISSIONS_LIMIT,
  ): Promise<ServiceResult<RecentSubmission[]>> {
    try {
      const data = await this.client.query<RawRecentResponse>(RECENT_QUERY, {
        username,
        limit,
      });
      const list = data.recentAcSubmissionList ?? [];
      if (list.length === 0) return R.unavailable();
      return R.ok(normalizeRecent(list));
    } catch (err) {
      return R.fail(classifyError(err).message);
    }
  }

  /** Topic-tag solve stats, or unavailable if nothing solved in any tag. */
  async fetchTopicStats(
    username: string,
  ): Promise<ServiceResult<TopicStats>> {
    try {
      const data = await this.client.query<RawTopicsResponse>(TOPICS_QUERY, {
        username,
      });
      const raw = data.matchedUser?.tagProblemCounts;
      if (!raw) return R.unavailable();
      const topics = normalizeTopics(raw);
      if (!topics) return R.unavailable();
      return R.ok(topics);
    } catch (err) {
      return R.fail(classifyError(err).message);
    }
  }
}
