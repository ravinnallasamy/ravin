/** Small pure numeric helpers used across aggregation. */

/** Percentage of `part` over `total`, 0 when total is 0, rounded to `dp`. */
export function percentage(part: number, total: number, dp = 1): number {
  if (total <= 0) return 0;
  const factor = 10 ** dp;
  return Math.round((part / total) * 100 * factor) / factor;
}

/** Sums a list of numbers. */
export function sum(values: number[]): number {
  return values.reduce((acc, n) => acc + n, 0);
}

/** Max of a list, or `fallback` when empty. */
export function maxOf(values: number[], fallback = 0): number {
  return values.length === 0 ? fallback : Math.max(...values);
}

/** Clamps `n` into the inclusive [min, max] range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
