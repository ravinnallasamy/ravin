/**
 * Transforms for chart-friendly series. The charts/ phase consumes these,
 * so shapes are deliberately minimal and library-agnostic (x/y points).
 */

import type { LanguageStat, TimeBucket } from '../types';

/** A generic 2D point for line/bar series. */
export interface SeriesPoint {
  x: string;
  y: number;
}

/** A slice for pie/donut charts. */
export interface Slice {
  label: string;
  value: number;
  percentage: number;
}

/** Maps time buckets to x/y points (x = label, y = count). */
export function bucketsToSeries(buckets: TimeBucket[]): SeriesPoint[] {
  return buckets.map((b) => ({ x: b.label, y: b.count }));
}

/**
 * Top-N language slices, with the remainder folded into a single "Other"
 * slice so a donut chart stays legible. Percentages are re-derived over the
 * provided stats (assumed already summing to ~100).
 */
export function languagesToSlices(
  languages: LanguageStat[],
  topN = 6,
): Slice[] {
  const top = languages.slice(0, topN);
  const rest = languages.slice(topN);

  const slices: Slice[] = top.map((l) => ({
    label: l.name,
    value: l.bytes,
    percentage: l.percentage,
  }));

  if (rest.length > 0) {
    slices.push({
      label: 'Other',
      value: rest.reduce((acc, l) => acc + l.bytes, 0),
      percentage: Math.round(
        rest.reduce((acc, l) => acc + l.percentage, 0) * 10,
      ) / 10,
    });
  }

  return slices;
}

/** Weekday distribution (index 0=Sun..6=Sat) as labelled points. */
export function weekdayToSeries(byWeekday: number[]): SeriesPoint[] {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return byWeekday.map((y, i) => ({ x: labels[i] ?? String(i), y }));
}
