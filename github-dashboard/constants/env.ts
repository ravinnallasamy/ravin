import 'server-only';

import {
  DEFAULT_REFRESH_INTERVAL,
  REFRESH_INTERVALS,
  type AccountKey,
  type RefreshIntervalKey,
} from './index';

/**
 * Server-only, validated access to the GitHub dashboard's environment.
 *
 * SERVER-ONLY: this module reads GITHUB_TOKEN_* and must never be imported
 * into a client component. None of these vars are `NEXT_PUBLIC_`-prefixed,
 * so Next.js will not inline them into the client bundle even by accident.
 * Only the service layer and route handlers (both server) import this.
 */

/** Credentials + identity for a single GitHub account. */
export interface AccountCredentials {
  readonly key: AccountKey;
  readonly username: string;
  readonly token: string;
}

/** Fully resolved, validated dashboard configuration. */
export interface DashboardEnv {
  readonly accounts: readonly AccountCredentials[];
  readonly refreshIntervalKey: RefreshIntervalKey;
  readonly refreshIntervalSeconds: number;
}

function readVar(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function isRefreshKey(value: string | undefined): value is RefreshIntervalKey {
  return value !== undefined && value in REFRESH_INTERVALS;
}

let cached: DashboardEnv | null = null;

/**
 * Reads and validates dashboard env vars once, then memoises the result.
 *
 * An account is only included if BOTH its username and token are present,
 * so a half-configured secondary account is simply skipped rather than
 * causing failed, unauthenticated requests. Throws only when NO account
 * is configured at all — a genuine misconfiguration the operator must fix.
 */
export function getDashboardEnv(): DashboardEnv {
  if (cached) return cached;

  const candidates: Array<{
    key: AccountKey;
    username?: string;
    token?: string;
  }> = [
    {
      key: 'primary',
      username: readVar('GITHUB_USERNAME_PRIMARY'),
      token: readVar('GITHUB_TOKEN_PRIMARY'),
    },
    {
      key: 'secondary',
      username: readVar('GITHUB_USERNAME_SECONDARY'),
      token: readVar('GITHUB_TOKEN_SECONDARY'),
    },
  ];

  const accounts: AccountCredentials[] = candidates
    .filter(
      (c): c is { key: AccountKey; username: string; token: string } =>
        Boolean(c.username) && Boolean(c.token),
    )
    .map(({ key, username, token }) => ({ key, username, token }));

  if (accounts.length === 0) {
    throw new Error(
      '[github-dashboard] No GitHub accounts configured. Set GITHUB_USERNAME_PRIMARY and GITHUB_TOKEN_PRIMARY (see .env.example).',
    );
  }

  const rawInterval = readVar('GITHUB_REFRESH_INTERVAL');
  const refreshIntervalKey: RefreshIntervalKey = isRefreshKey(rawInterval)
    ? rawInterval
    : DEFAULT_REFRESH_INTERVAL;

  cached = {
    accounts,
    refreshIntervalKey,
    refreshIntervalSeconds: REFRESH_INTERVALS[refreshIntervalKey],
  };
  return cached;
}

/**
 * Non-throwing probe of configuration state, safe to call anywhere.
 * Useful for API routes that want to report "not configured" instead of 500.
 */
export function isDashboardConfigured(): boolean {
  try {
    getDashboardEnv();
    return true;
  } catch {
    return false;
  }
}

/** Test/hot-reload seam: clears the memoised env so it is re-read. */
export function resetDashboardEnvCache(): void {
  cached = null;
}
