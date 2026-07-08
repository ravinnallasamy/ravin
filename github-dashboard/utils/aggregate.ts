/**
 * Commit/contribution aggregation into daily/weekly/monthly/yearly buckets,
 * plus language aggregation. All pure and derived from the merged calendar
 * and repositories.
 */

import type {
  CommitAggregate,
  ContributionCalendar,
  LanguageStat,
  Repository,
  TimeBucket,
} from '../types';
import { flattenCalendar } from './contributions';
import { percentage, sum } from './math';
import { monthLabel, toIsoWeekKey, toMonthKey, toYearKey } from './date';

/** Buckets calendar days by a key function, summing counts, chronologically. */
function bucketBy(
  calendar: ContributionCalendar,
  keyFn: (dateKey: string) => string,
  labelFn: (key: string) => string,
): TimeBucket[] {
  const totals = new Map<string, number>();
  for (const day of flattenCalendar(calendar)) {
    const key = keyFn(day.date);
    totals.set(key, (totals.get(key) ?? 0) + day.count);
  }
  return [...totals.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, count]) => ({ key, label: labelFn(key), count }));
}

/** Full daily/weekly/monthly/yearly aggregation of a merged calendar. */
export function aggregateCommits(calendar: ContributionCalendar): CommitAggregate {
  return {
    daily: bucketBy(calendar, (d) => d, (k) => k),
    weekly: bucketBy(calendar, toIsoWeekKey, (k) => k),
    monthly: bucketBy(calendar, toMonthKey, monthLabel),
    yearly: bucketBy(calendar, toYearKey, (k) => k),
  };
}

/**
 * Aggregates language bytes across repositories into ranked stats.
 * Sums per-language bytes, counts repos where each is primary, and computes
 * each language's percentage of the grand total. Sorted by bytes desc.
 */
export function aggregateLanguages(repositories: Repository[]): LanguageStat[] {
  const bytesByLang = new Map<string, number>();
  const repoCountByLang = new Map<string, number>();

  for (const repo of repositories) {
    for (const [lang, bytes] of Object.entries(repo.languages.bytes)) {
      bytesByLang.set(lang, (bytesByLang.get(lang) ?? 0) + bytes);
    }
    if (repo.primaryLanguage) {
      repoCountByLang.set(
        repo.primaryLanguage,
        (repoCountByLang.get(repo.primaryLanguage) ?? 0) + 1,
      );
    }
  }

  const totalBytes = sum([...bytesByLang.values()]);

  return [...bytesByLang.entries()]
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: percentage(bytes, totalBytes),
      repoCount: repoCountByLang.get(name) ?? 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}
