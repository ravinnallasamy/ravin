/**
 * Chart-data transformers: normalised models -> the ready-to-render series
 * shapes in `types/charts`. Pure functions the UI phase calls to feed its
 * chart components, keeping those components free of transformation logic.
 */

import { DIFFICULTY_COLORS } from '../constants';
import type {
  ContestData,
  ProblemStats,
  TopicStats,
} from '../types/models';
import type {
  DifficultyProgress,
  DifficultySlice,
  RatingTrendPoint,
  RatingTrendSeries,
  TopicBar,
} from '../types/charts';
import { netChange, pct } from './math';

/**
 * Solved-by-difficulty slices for a pie/donut. `value` is the solved count;
 * `percentage` is each difficulty's share of TOTAL SOLVED (so slices sum ~100).
 */
export function toDifficultySlices(stats: ProblemStats): DifficultySlice[] {
  return stats.byDifficulty.map((d) => ({
    difficulty: d.difficulty,
    value: d.solved,
    percentage: pct(d.solved, stats.totalSolved),
    color: DIFFICULTY_COLORS[d.difficulty],
  }));
}

/**
 * Progress bars: solved vs. available per difficulty. `percentage` here is
 * solved/total (completion), distinct from the slice share above.
 */
export function toDifficultyProgress(
  stats: ProblemStats,
): DifficultyProgress[] {
  return stats.byDifficulty.map((d) => ({
    difficulty: d.difficulty,
    solved: d.solved,
    total: d.total,
    percentage: d.percentage,
    color: DIFFICULTY_COLORS[d.difficulty],
  }));
}

/**
 * Contest-rating trend line over attended contests (oldest-first), with each
 * point's delta vs. the previous contest and summary extremes.
 */
export function toRatingTrend(contest: ContestData): RatingTrendSeries {
  const points: RatingTrendPoint[] = contest.history.map((h, i, arr) => ({
    date: h.startTime,
    timestamp: h.startTimestamp,
    rating: h.rating,
    label: h.title,
    delta: i === 0 ? 0 : Math.round((h.rating - arr[i - 1].rating) * 100) / 100,
  }));

  const ratings = points.map((p) => p.rating);
  return {
    points,
    minRating: ratings.length ? Math.min(...ratings) : 0,
    maxRating: ratings.length ? Math.max(...ratings) : 0,
    netChange: Math.round(netChange(ratings) * 100) / 100,
  };
}

/**
 * Topic bars for a bar chart, top `limit` tags by solved count (default 15).
 */
export function toTopicBars(topics: TopicStats, limit = 15): TopicBar[] {
  return topics.all.slice(0, limit).map((t) => ({
    name: t.name,
    slug: t.slug,
    level: t.level,
    problemsSolved: t.problemsSolved,
  }));
}
