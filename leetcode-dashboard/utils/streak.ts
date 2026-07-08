/**
 * Streak calculations over the submission calendar. LeetCode reports a `streak`
 * field, but it's opaque; these helpers derive current/longest streaks from the
 * actual day data so the UI can show start/end dates too.
 */

import type { SubmissionCalendar } from '../types/models';
import { addDays, daysBetween, todayKey } from './date';

export interface StreakResult {
  currentStreakDays: number;
  currentStreakStart: string | null;
  longestStreakDays: number;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
}

/**
 * Computes current and longest active-day streaks from the calendar's active
 * days. A "streak" is a run of consecutive calendar days each with >=1
 * submission. The current streak counts back from today (or yesterday, so a
 * day not yet coded doesn't break an otherwise-live streak).
 */
export function computeStreaks(
  calendar: SubmissionCalendar,
  today = todayKey(),
): StreakResult {
  const activeDates = calendar.days
    .filter((d) => d.count > 0)
    .map((d) => d.date)
    .sort();

  if (activeDates.length === 0) {
    return {
      currentStreakDays: 0,
      currentStreakStart: null,
      longestStreakDays: 0,
      longestStreakStart: null,
      longestStreakEnd: null,
    };
  }

  const dateSet = new Set(activeDates);

  // Longest streak: single forward pass over the sorted unique dates.
  let longest = 1;
  let longestStart = activeDates[0];
  let longestEnd = activeDates[0];
  let runStart = activeDates[0];
  let runLen = 1;

  for (let i = 1; i < activeDates.length; i += 1) {
    const prev = activeDates[i - 1];
    const curr = activeDates[i];
    if (daysBetween(prev, curr) === 1) {
      runLen += 1;
    } else {
      runLen = 1;
      runStart = curr;
    }
    if (runLen > longest) {
      longest = runLen;
      longestStart = runStart;
      longestEnd = curr;
    }
  }

  // Current streak: walk backward from today (allowing today to be inactive).
  let anchor = dateSet.has(today) ? today : addDays(today, -1);
  let current = 0;
  let currentStart: string | null = null;
  while (dateSet.has(anchor)) {
    current += 1;
    currentStart = anchor;
    anchor = addDays(anchor, -1);
  }

  return {
    currentStreakDays: current,
    currentStreakStart: currentStart,
    longestStreakDays: longest,
    longestStreakStart: longestStart,
    longestStreakEnd: longestEnd,
  };
}
