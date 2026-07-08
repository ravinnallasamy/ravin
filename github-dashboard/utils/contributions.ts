/**
 * Contribution-calendar derived calculations: intensity levels, streaks,
 * activity peaks, and per-weekday distribution. All pure.
 */

import type {
  ActivityPeaks,
  StreakStat,
} from '../types';
import type { ContributionCalendar, ContributionDay } from '../types';
import { maxOf } from './math';
import {
  isConsecutiveDay,
  monthLabel,
  toMonthKey,
  weekdayIndex,
} from './date';

/** Flattens a calendar's weeks into a chronologically ordered day list. */
export function flattenCalendar(calendar: ContributionCalendar): ContributionDay[] {
  return calendar.weeks
    .flatMap((w) => w.days)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Computes the four intensity thresholds (level 1..4 lower bounds) from the
 * max count, using GitHub-style quartile buckets. Level 0 == count 0.
 */
export function computeThresholds(maxCount: number): [number, number, number, number] {
  if (maxCount <= 0) return [1, 1, 1, 1];
  const q = maxCount / 4;
  return [
    1,
    Math.max(2, Math.ceil(q)),
    Math.max(3, Math.ceil(q * 2)),
    Math.max(4, Math.ceil(q * 3)),
  ];
}

/** Maps a raw count to a 0-4 level given precomputed thresholds. */
export function levelForCount(
  count: number,
  thresholds: [number, number, number, number],
): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count >= thresholds[3]) return 4;
  if (count >= thresholds[2]) return 3;
  if (count >= thresholds[1]) return 2;
  return 1;
}

/**
 * Recomputes every day's `level` after a merge changed the counts.
 * Returns a new calendar; input is not mutated.
 */
export function recomputeLevels(calendar: ContributionCalendar): ContributionCalendar {
  const days = flattenCalendar(calendar);
  const maxCount = maxOf(days.map((d) => d.count));
  const thresholds = computeThresholds(maxCount);
  return {
    ...calendar,
    weeks: calendar.weeks.map((week) => ({
      ...week,
      days: week.days.map((day) => ({
        ...day,
        level: levelForCount(day.count, thresholds),
      })),
    })),
  };
}

/**
 * Current and longest streaks of consecutive days with count > 0.
 * "Current" is anchored to the calendar's last day.
 */
export function computeStreaks(calendar: ContributionCalendar): StreakStat {
  const days = flattenCalendar(calendar);

  let longest = 0;
  let longestStart: string | null = null;
  let longestEnd: string | null = null;

  let runLen = 0;
  let runStart: string | null = null;
  let prevDate: string | null = null;

  for (const day of days) {
    const active = day.count > 0;
    const continues =
      active && prevDate !== null && isConsecutiveDay(prevDate, day.date);

    if (active) {
      if (continues && runStart) {
        runLen += 1;
      } else {
        runLen = 1;
        runStart = day.date;
      }
      if (runLen > longest) {
        longest = runLen;
        longestStart = runStart;
        longestEnd = day.date;
      }
    } else {
      runLen = 0;
      runStart = null;
    }
    prevDate = day.date;
  }

  // Current streak: walk back from the most recent day while active+consecutive.
  let currentLen = 0;
  let currentStart: string | null = null;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    const day = days[i];
    if (day.count <= 0) break;
    if (
      currentStart !== null &&
      !isConsecutiveDay(day.date, days[i + 1]?.date ?? day.date)
    ) {
      break;
    }
    currentLen += 1;
    currentStart = day.date;
  }

  return {
    currentStreakDays: currentLen,
    currentStreakStart: currentStart,
    longestStreakDays: longest,
    longestStreakStart: longestStart,
    longestStreakEnd: longestEnd,
  };
}

/** Most active day, most active month, and per-weekday distribution. */
export function computePeaks(calendar: ContributionCalendar): ActivityPeaks {
  const days = flattenCalendar(calendar);

  let mostActiveDay: ActivityPeaks['mostActiveDay'] = null;
  const byMonth = new Map<string, number>();
  const byWeekday = [0, 0, 0, 0, 0, 0, 0];

  for (const day of days) {
    if (day.count > 0 && (!mostActiveDay || day.count > mostActiveDay.count)) {
      mostActiveDay = { date: day.date, count: day.count };
    }
    const mk = toMonthKey(day.date);
    byMonth.set(mk, (byMonth.get(mk) ?? 0) + day.count);
    byWeekday[weekdayIndex(day.date)] += day.count;
  }

  let mostActiveMonth: ActivityPeaks['mostActiveMonth'] = null;
  for (const [key, count] of byMonth) {
    if (count > 0 && (!mostActiveMonth || count > mostActiveMonth.count)) {
      mostActiveMonth = { key, label: monthLabel(key), count };
    }
  }

  return { mostActiveDay, mostActiveMonth, byWeekday };
}
