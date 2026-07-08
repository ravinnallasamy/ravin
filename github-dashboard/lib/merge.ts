/**
 * Pure, unit-testable merge utilities.
 *
 * These combine per-account data into a single unified identity. None of them
 * fetch, cache, or throw on I/O — given the same inputs they always return the
 * same output. The service layer calls them after fetching.
 *
 * Contribution merging is the key rule: counts SUM per calendar day. If
 * account A has 6 and account B has 4 on the same date, the merged day is 10.
 */

import type {
  ActivityEvent,
  ContributionCalendar,
  ContributionDay,
  ContributionTotals,
  ContributionWeek,
  FollowerRef,
  LanguageStat,
  MergedStatistics,
  Organization,
  Repository,
} from '../types';
import type { AccountData } from '../types';
import { recomputeLevels } from '../utils/contributions';
import { aggregateLanguages } from '../utils/aggregate';
import { toDateKey, parseDate, minDate } from '../utils/date';

/**
 * Merge repositories from all accounts.
 * Repos are owned per account so there is no cross-account duplication, but we
 * still de-dupe defensively on `fullName` (last write wins) in case the same
 * repo is reachable via both tokens (e.g. a shared org repo).
 */
export function mergeRepositories(sources: Repository[][]): Repository[] {
  const byFullName = new Map<string, Repository>();
  for (const repos of sources) {
    for (const repo of repos) {
      byFullName.set(repo.fullName, repo);
    }
  }
  return [...byFullName.values()];
}

/**
 * Merge contribution calendars by SUMMING counts per calendar day across all
 * accounts, then rebuilding the week grid and recomputing intensity levels.
 *
 * The union of all dates is used, so accounts with different date ranges still
 * combine correctly. Weeks are reconstructed as contiguous Sunday-started
 * blocks over the full date span.
 */
export function mergeContributions(
  calendars: ContributionCalendar[],
): ContributionCalendar {
  const countByDate = new Map<string, number>();

  for (const calendar of calendars) {
    for (const week of calendar.weeks) {
      for (const day of week.days) {
        countByDate.set(day.date, (countByDate.get(day.date) ?? 0) + day.count);
      }
    }
  }

  if (countByDate.size === 0) {
    return { totalContributions: 0, weeks: [] };
  }

  const dates = [...countByDate.keys()].sort((a, b) => a.localeCompare(b));
  const days: ContributionDay[] = dates.map((date) => ({
    date,
    count: countByDate.get(date) ?? 0,
    level: 0, // recomputed below
  }));

  const weeks = groupIntoWeeks(days);
  const totalContributions = days.reduce((acc, d) => acc + d.count, 0);

  // Levels depend on the merged max, so recompute after summing.
  return recomputeLevels({ totalContributions, weeks });
}

/** Groups chronologically-sorted days into Sunday-started calendar weeks. */
function groupIntoWeeks(days: ContributionDay[]): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  let current: ContributionDay[] = [];

  for (const day of days) {
    const weekday = parseDate(day.date).getUTCDay(); // 0=Sun
    if (weekday === 0 && current.length > 0) {
      weeks.push({ firstDay: current[0].date, days: current });
      current = [];
    }
    current.push(day);
  }
  if (current.length > 0) {
    weeks.push({ firstDay: current[0].date, days: current });
  }
  return weeks;
}

/**
 * Merge per-repository language byte counts across accounts into ranked
 * language stats (bytes summed, percentages recomputed).
 */
export function mergeLanguages(sources: Repository[][]): LanguageStat[] {
  return aggregateLanguages(sources.flat());
}

/** Merge event streams into one chronological (newest-first) list. */
export function mergeEvents(sources: ActivityEvent[][]): ActivityEvent[] {
  return sources
    .flat()
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

/** Merge organisation memberships, de-duped by org id. */
export function mergeOrganizations(sources: Organization[][]): Organization[] {
  const byId = new Map<number, Organization>();
  for (const orgs of sources) {
    for (const org of orgs) byId.set(org.id, org);
  }
  return [...byId.values()].sort((a, b) => a.login.localeCompare(b.login));
}

/**
 * Merge follower lists, de-duped by login so a person who follows both
 * accounts is counted once (true combined reach, not a naive sum).
 */
export function mergeFollowers(sources: FollowerRef[][]): FollowerRef[] {
  const byLogin = new Map<string, FollowerRef>();
  for (const followers of sources) {
    for (const f of followers) byLogin.set(f.login, f);
  }
  return [...byLogin.values()];
}

/** Sums contribution totals field-by-field. */
function sumTotals(totals: ContributionTotals[]): ContributionTotals {
  return totals.reduce<ContributionTotals>(
    (acc, t) => ({
      totalCommitContributions:
        acc.totalCommitContributions + t.totalCommitContributions,
      totalPullRequestContributions:
        acc.totalPullRequestContributions + t.totalPullRequestContributions,
      totalIssueContributions:
        acc.totalIssueContributions + t.totalIssueContributions,
      totalPullRequestReviewContributions:
        acc.totalPullRequestReviewContributions +
        t.totalPullRequestReviewContributions,
      totalRepositoryContributions:
        acc.totalRepositoryContributions + t.totalRepositoryContributions,
    }),
    {
      totalCommitContributions: 0,
      totalPullRequestContributions: 0,
      totalIssueContributions: 0,
      totalPullRequestReviewContributions: 0,
      totalRepositoryContributions: 0,
    },
  );
}

/**
 * Merge every account into the top-line statistics block.
 *
 * Repos/stars/forks are summed over the de-duped merged repo set — this
 * includes private repos, so aggregate numbers reflect real activity even
 * though private repo *details* are never exposed (see `lib/combine.ts`,
 * which passes ALL repos here but only public repos to `MergedDashboard.
 * repositories`). Followers use the de-duped count (combined reach).
 * `memberSince` is the earliest account creation date.
 */
export function mergeStatistics(
  accounts: AccountData[],
  mergedRepositories: Repository[],
  mergedFollowers: FollowerRef[],
  mergedOrganizations: Organization[],
  mergedLanguages: LanguageStat[],
  mergedCalendar: ContributionCalendar,
): MergedStatistics {
  const totals = sumTotals(accounts.map((a) => a.contributionTotals));

  const totalStars = mergedRepositories.reduce((acc, r) => acc + r.stargazers, 0);
  const totalForks = mergedRepositories.reduce((acc, r) => acc + r.forks, 0);
  const totalWatchers = mergedRepositories.reduce((acc, r) => acc + r.watchers, 0);
  const totalOpenIssues = mergedRepositories.reduce(
    (acc, r) => acc + r.openIssues,
    0,
  );
  const totalFollowing = accounts.reduce((acc, a) => acc + a.profile.following, 0);
  const privateRepositories = mergedRepositories.filter((r) => r.isPrivate).length;

  const memberSince = accounts
    .map((a) => a.profile.createdAt)
    .reduce((earliest, d) => (earliest ? minDate(earliest, d) : d));

  return {
    totalRepositories: mergedRepositories.length,
    publicRepositories: mergedRepositories.length - privateRepositories,
    privateRepositories,
    totalStars,
    totalForks,
    totalWatchers,
    totalOpenIssues,
    totalContributions: mergedCalendar.totalContributions,
    totalCommits: totals.totalCommitContributions,
    totalPullRequests: totals.totalPullRequestContributions,
    totalIssues: totals.totalIssueContributions,
    totalReviews: totals.totalPullRequestReviewContributions,
    totalFollowers: mergedFollowers.length,
    totalFollowing,
    totalOrganizations: mergedOrganizations.length,
    languageCount: mergedLanguages.length,
    memberSince: toDateKey(parseDate(memberSince)),
  };
}
