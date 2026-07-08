/**
 * Heatmap transformation: a normalised {@link SubmissionCalendar} -> a
 * ready-to-render {@link HeatmapSeries} grid.
 *
 * The grid is column-major by week (GitHub-style): each column is a Sun-Sat
 * week, each row a weekday (0=Sun..6=Sat). Levels 0-4 are computed from the
 * observed max via quartile thresholds, so the legend is always meaningful for
 * whatever range the user's activity spans.
 */

import type { SubmissionCalendar } from '../types/models';
import type { HeatmapCell, HeatmapSeries } from '../types/charts';
import { addDays, daysBetween, todayKey, weekdayOf } from './date';

/** Computes inclusive level thresholds [l1,l2,l3,l4] from the max daily count. */
export function computeThresholds(
  maxCount: number,
): [number, number, number, number] {
  if (maxCount <= 0) return [1, 1, 1, 1];
  if (maxCount <= 4) return [1, 2, 3, 4];
  const q = maxCount / 4;
  return [
    1,
    Math.max(2, Math.ceil(q)),
    Math.max(3, Math.ceil(q * 2)),
    Math.max(4, Math.ceil(q * 3)),
  ];
}

/** Maps a raw count to an intensity level 0-4 using precomputed thresholds. */
export function levelFor(
  count: number,
  thresholds: [number, number, number, number],
): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count >= thresholds[3]) return 4;
  if (count >= thresholds[2]) return 3;
  if (count >= thresholds[1]) return 2;
  return 1;
}

export interface BuildHeatmapOptions {
  /** How many trailing days to render. Default 371 (53 weeks). */
  days?: number;
  /** Anchor "today" (for tests/determinism). Defaults to now. */
  endDateKey?: string;
}

/**
 * Builds a dense, gap-filled heatmap grid over a trailing window ending today.
 * Days with no submissions are included with count 0 (level 0), so the grid is
 * rectangular and calendar-aligned rather than sparse.
 */
export function buildHeatmap(
  calendar: SubmissionCalendar,
  options: BuildHeatmapOptions = {},
): HeatmapSeries {
  const windowDays = options.days ?? 371;
  const endKey = options.endDateKey ?? todayKey();

  // Index submissions by date for O(1) lookup while walking the window.
  const countByDate = new Map<string, number>();
  for (const day of calendar.days) {
    countByDate.set(day.date, (countByDate.get(day.date) ?? 0) + day.count);
  }

  // Align the window start back to the preceding Sunday so column 0 is a full
  // week, matching the GitHub-style grid the UI renders.
  const rawStart = addDays(endKey, -(windowDays - 1));
  const startKey = addDays(rawStart, -weekdayOf(rawStart));
  const totalDays = daysBetween(startKey, endKey) + 1;

  let maxCount = 0;
  for (let i = 0; i < totalDays; i += 1) {
    const date = addDays(startKey, i);
    const count = countByDate.get(date) ?? 0;
    if (count > maxCount) maxCount = count;
  }

  const thresholds = computeThresholds(maxCount);
  const cells: HeatmapCell[] = [];

  for (let i = 0; i < totalDays; i += 1) {
    const date = addDays(startKey, i);
    const count = countByDate.get(date) ?? 0;
    const weekday = weekdayOf(date);
    cells.push({
      date,
      count,
      level: levelFor(count, thresholds),
      week: Math.floor(i / 7),
      weekday,
    });
  }

  const weeks = cells.length ? cells[cells.length - 1].week + 1 : 0;

  return {
    cells,
    weeks,
    thresholds,
    maxCount,
    startDate: startKey,
    endDate: endKey,
  };
}
