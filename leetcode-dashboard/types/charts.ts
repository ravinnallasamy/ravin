/**
 * Chart-ready data shapes the UI phase will consume.
 *
 * The `utils/chart` transformers produce exactly these shapes from the
 * normalised models, so chart components stay dumb: they receive a typed series
 * and render it. Kept generic enough to feed Recharts (already a dependency) or
 * any other library without leaking library types into the module.
 */

import type { Difficulty } from '../constants';

/** A labelled slice for a difficulty pie/donut (solved-by-difficulty). */
export interface DifficultySlice {
  difficulty: Difficulty;
  value: number;
  /** Share of total solved, 0-100 rounded to 1 decimal. */
  percentage: number;
  /** Canonical difficulty colour, from DIFFICULTY_COLORS. */
  color: string;
}

/** A progress datum: solved out of available at one difficulty. */
export interface DifficultyProgress {
  difficulty: Difficulty;
  solved: number;
  total: number;
  /** solved/total * 100, 0-100 rounded to 1 decimal. */
  percentage: number;
  color: string;
}

/** One cell of the calendar heatmap grid. */
export interface HeatmapCell {
  /** ISO date "YYYY-MM-DD". */
  date: string;
  count: number;
  /** Intensity bucket 0-4 (0 = no activity). */
  level: 0 | 1 | 2 | 3 | 4;
  /** Column index (week) in the grid. */
  week: number;
  /** Row index (0 = Sunday .. 6 = Saturday). */
  weekday: number;
}

/** A full heatmap grid + legend thresholds, ready to render. */
export interface HeatmapSeries {
  cells: HeatmapCell[];
  weeks: number;
  /** Inclusive lower bounds for levels 1..4 (level 0 is always count 0). */
  thresholds: [number, number, number, number];
  maxCount: number;
  /** ISO date of the first day rendered. */
  startDate: string;
  /** ISO date of the last day rendered. */
  endDate: string;
}

/** A point on the contest-rating trend line. */
export interface RatingTrendPoint {
  /** ISO-8601 contest start time. */
  date: string;
  /** Unix seconds — for ordering / x-axis scaling. */
  timestamp: number;
  rating: number;
  /** Contest title, for tooltips. */
  label: string;
  /** Delta vs. the previous attended contest (0 for the first). */
  delta: number;
}

/** Contest rating trend series with summary extremes. */
export interface RatingTrendSeries {
  points: RatingTrendPoint[];
  minRating: number;
  maxRating: number;
  /** Net change from first to last attended contest. */
  netChange: number;
}

/** A bar in the topic-tag bar chart. */
export interface TopicBar {
  name: string;
  slug: string;
  level: 'fundamental' | 'intermediate' | 'advanced';
  problemsSolved: number;
}
