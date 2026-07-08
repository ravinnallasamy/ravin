/**
 * Turns a merged contribution calendar into a render-ready heatmap grid
 * (week columns x weekday rows) with legend thresholds. Pure.
 */

import type { ContributionCalendar, Heatmap, HeatmapCell } from '../types';
import {
  computeThresholds,
  flattenCalendar,
  levelForCount,
} from './contributions';
import { maxOf } from './math';
import { weekdayIndex } from './date';

/**
 * Builds the heatmap. Week index is derived from position in the calendar's
 * `weeks` array so the grid matches GitHub's column layout; weekday row is
 * 0=Sunday..6=Saturday.
 */
export function buildHeatmap(calendar: ContributionCalendar): Heatmap {
  const maxCount = maxOf(flattenCalendar(calendar).map((d) => d.count));
  const thresholds = computeThresholds(maxCount);

  const cells: HeatmapCell[] = [];
  calendar.weeks.forEach((week, weekIdx) => {
    for (const day of week.days) {
      cells.push({
        date: day.date,
        count: day.count,
        level: levelForCount(day.count, thresholds),
        week: weekIdx,
        weekday: weekdayIndex(day.date),
      });
    }
  });

  return {
    cells,
    weeks: calendar.weeks.length,
    thresholds,
    maxCount,
  };
}
