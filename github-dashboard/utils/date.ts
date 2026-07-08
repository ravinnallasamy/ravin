/**
 * Pure date helpers. All calendar math is done in UTC so results are stable
 * regardless of the server's timezone.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Parses "YYYY-MM-DD" (or ISO) into a UTC-midnight Date. */
export function parseDate(iso: string): Date {
  const d = new Date(iso);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Formats a Date as "YYYY-MM-DD" in UTC. */
export function toDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole-day difference (b - a), UTC. */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / MS_PER_DAY);
}

/** Returns true when two date keys are consecutive calendar days. */
export function isConsecutiveDay(earlier: string, later: string): boolean {
  return daysBetween(earlier, later) === 1;
}

/** "YYYY-MM" month key for a date key. */
export function toMonthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

/** "YYYY" year key for a date key. */
export function toYearKey(dateKey: string): string {
  return dateKey.slice(0, 4);
}

/**
 * ISO-week key "YYYY-Www" for a date key (weeks start Monday, ISO-8601).
 */
export function toIsoWeekKey(dateKey: string): string {
  const date = parseDate(dateKey);
  const day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(); // Mon=1..Sun=7
  // Thursday of this week decides the ISO year.
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + (4 - day));
  const isoYear = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7,
  );
  return `${isoYear}-W${String(week).padStart(2, '0')}`;
}

/** Human month label "Mon YYYY" from a "YYYY-MM" key. */
export function monthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-');
  const idx = Number(m) - 1;
  return `${MONTH_LABELS[idx] ?? '???'} ${y}`;
}

/** Weekday label from index 0=Sunday..6=Saturday. */
export function weekdayLabel(index: number): string {
  return WEEKDAY_LABELS[index] ?? '???';
}

/** Weekday index 0=Sunday..6=Saturday for a date key. */
export function weekdayIndex(dateKey: string): number {
  return parseDate(dateKey).getUTCDay();
}

/** Returns the earlier of two ISO date strings. */
export function minDate(a: string, b: string): string {
  return new Date(a).getTime() <= new Date(b).getTime() ? a : b;
}

export { MS_PER_DAY, WEEKDAY_LABELS, MONTH_LABELS };
