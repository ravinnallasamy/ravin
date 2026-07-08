/**
 * Date helpers. Pure functions, no side effects, safe on server or client.
 * LeetCode timestamps are unix **seconds** (calendar keys, contest startTime,
 * submission timestamp), so everything here works in seconds unless noted.
 */

/** Unix seconds -> full ISO-8601 string (UTC). */
export function unixToIso(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString();
}

/** Unix seconds -> "YYYY-MM-DD" (UTC). */
export function unixToDateKey(unixSeconds: number): string {
  return unixToIso(unixSeconds).slice(0, 10);
}

/** "YYYY-MM-DD" (UTC midnight) -> unix seconds. */
export function dateKeyToUnix(dateKey: string): number {
  return Math.floor(Date.parse(`${dateKey}T00:00:00.000Z`) / 1000);
}

/** Weekday index for a date key, 0 = Sunday .. 6 = Saturday (UTC). */
export function weekdayOf(dateKey: string): number {
  return new Date(`${dateKey}T00:00:00.000Z`).getUTCDay();
}

/** Adds `days` (may be negative) to a "YYYY-MM-DD" key, returning a new key. */
export function addDays(dateKey: string, days: number): string {
  const ms = Date.parse(`${dateKey}T00:00:00.000Z`) + days * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

/** Inclusive whole-day difference between two date keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const ms =
    Date.parse(`${b}T00:00:00.000Z`) - Date.parse(`${a}T00:00:00.000Z`);
  return Math.round(ms / 86_400_000);
}

/**
 * Human-readable relative time from a unix-seconds timestamp, e.g. "3 days ago".
 * Falls back to an absolute date past ~30 days.
 */
export function relativeFromUnix(unixSeconds: number, now = Date.now()): string {
  const diffMs = now - unixSeconds * 1000;
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);

  if (sec < 60) return 'just now';
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  if (day <= 30) return `${day} day${day === 1 ? '' : 's'} ago`;
  return unixToDateKey(unixSeconds);
}

/** Today's date key in UTC. */
export function todayKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}
