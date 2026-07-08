import 'server-only';

/**
 * GitHubService — the ONLY entry point the rest of the app uses to obtain
 * dashboard data. No UI or route ever calls GitHub directly.
 *
 * Responsibilities:
 *  - orchestrate per-account fetches (in parallel, isolated failures)
 *  - merge/aggregate into the unified MergedDashboard (via lib/)
 *  - cache the result with the configured TTL (via cache/)
 *  - resilience: never throw to the caller; partial data rides in `meta`
 */

import { readThrough, dashboardCache } from '../cache';
import { CACHE_KEYS } from '../constants';
import { getDashboardEnv } from '../constants/env';
import { combineDashboard } from '../lib/combine';
import { toAccountError } from '../lib/errors';
import type {
  AccountData,
  AccountError,
  DashboardResult,
  MergedDashboard,
} from '../types';
import { fetchAccountData } from './account-fetcher';

/** Builds the merged dashboard by fetching every configured account. */
async function buildDashboard(): Promise<MergedDashboard> {
  const env = getDashboardEnv();

  const settled = await Promise.allSettled(
    env.accounts.map((creds) =>
      fetchAccountData(creds, env.refreshIntervalSeconds),
    ),
  );

  const accounts: AccountData[] = [];
  const errors: AccountError[] = [];

  settled.forEach((result, i) => {
    const creds = env.accounts[i];
    if (result.status === 'fulfilled') {
      accounts.push(result.value);
    } else {
      const err = toAccountError(creds.key, result.reason);
      errors.push(err);
      // Structured log; the data layer swallows the throw but records it.
      console.error(
        `[github-dashboard] account "${creds.key}" failed (${err.kind}): ${err.message}`,
      );
    }
  });

  // If EVERY account failed there's no data to assemble — surface via throw so
  // readThrough can fall back to a stale cache entry if one exists.
  if (accounts.length === 0) {
    throw new AllAccountsFailedError(errors);
  }

  return combineDashboard(accounts, errors, env.refreshIntervalSeconds);
}

/** Thrown internally when no account loaded; carries the per-account errors. */
export class AllAccountsFailedError extends Error {
  constructor(readonly errors: AccountError[]) {
    super('All configured GitHub accounts failed to load');
    this.name = 'AllAccountsFailedError';
  }
}

export class GitHubService {
  /**
   * Returns the merged dashboard, cache-first. Never throws:
   *  - success  -> { ok: true, data, stale }
   *  - total failure with no cache -> { ok: false, error, data: null }
   *
   * `stale` is true when a past-TTL cached snapshot was served because the
   * refresh failed (resilience). Partial success (one account down) still
   * returns ok:true, with details in `data.meta`.
   */
  async getDashboard(): Promise<DashboardResult> {
    const env = getDashboardEnv();
    try {
      const { value, stale } = await readThrough(
        CACHE_KEYS.dashboard,
        env.refreshIntervalSeconds,
        buildDashboard,
      );
      return { ok: true, data: value, stale };
    } catch (err) {
      const error: AccountError =
        err instanceof AllAccountsFailedError && err.errors[0]
          ? err.errors[0]
          : {
              account: 'all',
              kind: 'unknown',
              message: err instanceof Error ? err.message : String(err),
            };
      return { ok: false, error, data: null };
    }
  }

  /**
   * Forces a rebuild regardless of cache freshness and overwrites the cache.
   * Used by the scheduler / manual refresh route. Still never throws.
   */
  async refreshDashboard(): Promise<DashboardResult> {
    const env = getDashboardEnv();
    try {
      const data = await buildDashboard();
      await dashboardCache.set(
        CACHE_KEYS.dashboard,
        data,
        env.refreshIntervalSeconds,
      );
      return { ok: true, data, stale: false };
    } catch (err) {
      const error: AccountError =
        err instanceof AllAccountsFailedError && err.errors[0]
          ? err.errors[0]
          : {
              account: 'all',
              kind: 'unknown',
              message: err instanceof Error ? err.message : String(err),
            };
      return { ok: false, error, data: null };
    }
  }
}

/** Shared singleton instance. */
export const githubService = new GitHubService();
