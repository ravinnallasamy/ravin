/**
 * Numeric helpers. Pure, side-effect free, and defensive against divide-by-zero
 * (every ratio returns 0 rather than NaN/Infinity so the UI never renders NaN).
 */

/** Rounds to `decimals` places (default 1), avoiding float noise. */
export function round(value: number, decimals = 1): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/**
 * Percentage of `part` out of `whole`, 0-100, rounded to `decimals`.
 * Returns 0 when `whole` is 0 or non-finite (never NaN/Infinity).
 */
export function pct(part: number, whole: number, decimals = 1): number {
  if (!whole || !Number.isFinite(whole)) return 0;
  return round((part / whole) * 100, decimals);
}

/** Clamps `value` into the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Sum of an array of numbers (0 for empty). */
export function sum(values: readonly number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

/** Arithmetic mean, or 0 for an empty array. */
export function mean(values: readonly number[]): number {
  return values.length ? sum(values) / values.length : 0;
}

/**
 * Net change between the first and last element of a numeric series
 * (last - first). Returns 0 for series shorter than 2.
 */
export function netChange(values: readonly number[]): number {
  if (values.length < 2) return 0;
  return values[values.length - 1] - values[0];
}
