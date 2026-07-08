import 'server-only';

/**
 * Public service surface. UI/routes import from here only — never the HTTP
 * client, queries, or normalisers directly.
 */

import { CACHE_KEYS } from '../constants';
import { getLeetcodeEnv } from '../constants/env';
import { readThrough, leetcodeCache } from '../cache';
import type { DashboardResult, LeetcodeDashboard } from '../types';
import { buildDashboard } from './dashboard-builder';

export { LeetcodeService } from './leetcode-service';
export type { ServiceOptions } from './leetcode-service';
export { buildDashboard } from './dashboard-builder';

/**
 * Top-level dashboard accessor. Cache-first, never throws:
 *  - success -> { ok: true, data, stale }
 *  - only fails outright when the username can't be resolved (not configured).
 *
 * Per-section failures ride inside `data.*` results and `data.meta`, so a
 * degraded LeetCode never blanks the whole dashboard.
 */
export class LeetcodeDashboardService {
  async getDashboard(): Promise<DashboardResult> {
    let env;
    try {
      env = getLeetcodeEnv();
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        kind: 'unknown',
        data: null,
      };
    }

    const { value, stale } = await readThrough<LeetcodeDashboard>(
      CACHE_KEYS.dashboard(env.username.toLowerCase()),
      env.refreshIntervalSeconds,
      () => buildDashboard(env.username, env.refreshIntervalSeconds),
    );
    return { ok: true, data: value, stale };
  }

  /**
   * Forces a rebuild regardless of cache freshness and overwrites the cache.
   * Used by the scheduler / manual refresh route. Still never throws.
   */
  async refreshDashboard(): Promise<DashboardResult> {
    let env;
    try {
      env = getLeetcodeEnv();
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        kind: 'unknown',
        data: null,
      };
    }

    const data = await buildDashboard(env.username, env.refreshIntervalSeconds);
    await leetcodeCache.set(
      CACHE_KEYS.dashboard(env.username.toLowerCase()),
      data,
      env.refreshIntervalSeconds,
    );
    return { ok: true, data, stale: false };
  }
}

/** Shared singleton instance. */
export const leetcodeDashboardService = new LeetcodeDashboardService();
