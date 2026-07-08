import 'server-only';

import socialJson from '@/content/social.json';
import {
  DEFAULT_REFRESH_INTERVAL_SECONDS,
  MAX_REFRESH_INTERVAL_SECONDS,
  MIN_REFRESH_INTERVAL_SECONDS,
} from './index';

/**
 * Server-only, validated access to the LeetCode dashboard's configuration.
 *
 * SERVER-ONLY: keep this out of client components. None of these vars are
 * `NEXT_PUBLIC_`-prefixed, so Next.js will not inline them into the client
 * bundle. Only the service/API layers import this.
 *
 * Unlike the GitHub dashboard there are no tokens — LeetCode's public GraphQL
 * needs no auth — so the only real config is the username and the cadence.
 * The username falls back to `content/social.json`'s `leetcodeUsername` (the
 * same source `lib/leetcode.ts` uses) when `LEETCODE_USERNAME` is unset, so
 * the dashboard works out of the box for this portfolio.
 */

/** Fully resolved, validated dashboard configuration. */
export interface LeetcodeDashboardEnv {
  readonly username: string;
  readonly refreshIntervalSeconds: number;
}

function readVar(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

/**
 * Extracts a bare username from either a bare handle or a profile URL, e.g.
 * "https://leetcode.com/u/ravinit001/" -> "ravinit001". Mirrors the logic in
 * `lib/leetcode.ts` so both stay in sync.
 */
function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .replace(/\/+$/, '')
    .split('/')
    .pop()
    ?.trim() ?? '';
}

/**
 * Parses and clamps the refresh interval. Accepts an integer number of seconds
 * (LEETCODE_REFRESH_INTERVAL); falls back to the default on anything invalid,
 * and clamps to [MIN, MAX] so a typo can't hammer LeetCode or freeze data.
 */
function parseRefreshInterval(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_REFRESH_INTERVAL_SECONDS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_REFRESH_INTERVAL_SECONDS;
  }
  const seconds = Math.floor(parsed);
  return Math.min(
    Math.max(seconds, MIN_REFRESH_INTERVAL_SECONDS),
    MAX_REFRESH_INTERVAL_SECONDS,
  );
}

let cached: LeetcodeDashboardEnv | null = null;

/**
 * Reads and validates config once, then memoises. Throws only when no username
 * can be resolved from either the env var or social.json — a genuine
 * misconfiguration the operator must fix.
 */
export function getLeetcodeEnv(): LeetcodeDashboardEnv {
  if (cached) return cached;

  const envUsername = readVar('LEETCODE_USERNAME');
  const fallback = normalizeUsername(socialJson.leetcodeUsername ?? '');
  const username = envUsername ? normalizeUsername(envUsername) : fallback;

  if (!username) {
    throw new Error(
      '[leetcode-dashboard] No LeetCode username configured. Set LEETCODE_USERNAME (see .env.example) or content/social.json:leetcodeUsername.',
    );
  }

  cached = {
    username,
    refreshIntervalSeconds: parseRefreshInterval(
      readVar('LEETCODE_REFRESH_INTERVAL'),
    ),
  };
  return cached;
}

/**
 * Non-throwing probe of configuration state, safe to call anywhere. Lets API
 * routes report "not configured" instead of 500.
 */
export function isLeetcodeConfigured(): boolean {
  try {
    getLeetcodeEnv();
    return true;
  } catch {
    return false;
  }
}

/** Test/hot-reload seam: clears the memoised env so it is re-read. */
export function resetLeetcodeEnvCache(): void {
  cached = null;
}
