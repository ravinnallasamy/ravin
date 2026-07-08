/**
 * Assembles the full MergedDashboard from successfully-loaded accounts plus
 * any per-account errors. Pure — no fetching. This is the single place that
 * wires the merge utils and aggregation utils together into the UI contract.
 */

import type {
  AccountData,
  AccountError,
  DashboardMeta,
  MergedDashboard,
} from '../types';
import {
  mergeContributions,
  mergeEvents,
  mergeFollowers,
  mergeLanguages,
  mergeOrganizations,
  mergeRepositories,
  mergeStatistics,
} from './merge';
import { aggregateCommits } from '../utils/aggregate';
import { computePeaks, computeStreaks } from '../utils/contributions';
import { buildHeatmap } from '../utils/heatmap';
import { sortRepositories } from '../utils/sort';

/**
 * @param accounts Accounts that loaded successfully (may be a subset).
 * @param errors   Per-account failures to surface in `meta`.
 * @param refreshIntervalSeconds For `meta.refreshIntervalSeconds`.
 */
export function combineDashboard(
  accounts: AccountData[],
  errors: AccountError[],
  refreshIntervalSeconds: number,
): MergedDashboard {
  const repoSources = accounts.map((a) => a.repositories);

  // ALL repos (public + private) feed the aggregate stats/language totals
  // below, but only PUBLIC repos are ever exposed as the repositories list —
  // private repo names, URLs, and other details never leave this function.
  const allRepositories = mergeRepositories(repoSources);
  const publicRepositories = sortRepositories(
    allRepositories.filter((r) => !r.isPrivate),
    'stars',
  );
  const languages = mergeLanguages(repoSources);
  const contributionCalendar = mergeContributions(
    accounts.map((a) => a.contributionCalendar),
  );
  const followers = mergeFollowers(accounts.map((a) => a.followers));
  const organizations = mergeOrganizations(accounts.map((a) => a.organizations));
  const events = mergeEvents(accounts.map((a) => a.events));

  const statistics = mergeStatistics(
    accounts,
    allRepositories,
    followers,
    organizations,
    languages,
    contributionCalendar,
  );

  const commitAggregate = aggregateCommits(contributionCalendar);
  const streaks = computeStreaks(contributionCalendar);
  const peaks = computePeaks(contributionCalendar);
  const heatmap = buildHeatmap(contributionCalendar);

  const meta: DashboardMeta = {
    generatedAt: new Date().toISOString(),
    accountsLoaded: accounts.map((a) => a.account),
    partial: errors.length > 0,
    errors,
    refreshIntervalSeconds,
  };

  return {
    statistics,
    repositories: publicRepositories,
    languages,
    contributionCalendar,
    commitAggregate,
    streaks,
    peaks,
    heatmap,
    events,
    organizations,
    followers,
    meta,
  };
}
