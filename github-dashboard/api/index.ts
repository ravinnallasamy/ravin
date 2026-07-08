import 'server-only';

/**
 * Module-internal API layer: the thin functions the Next.js route handlers
 * (and server components) call. Keeps route handlers dumb and testable, and
 * ensures the scheduler is started on first server access.
 */

import { githubService } from '../services';
import { getDashboardEnv, isDashboardConfigured } from '../constants/env';
import { startScheduler } from './scheduler';
import type { DashboardResult } from '../types';

let schedulerBootstrapped = false;

/** Lazily starts the background scheduler the first time data is requested. */
function ensureScheduler(): void {
  if (schedulerBootstrapped) return;
  schedulerBootstrapped = true;
  startScheduler();
}

/** Cache-first merged dashboard for server components / the read route. */
export async function loadDashboard(): Promise<DashboardResult> {
  ensureScheduler();
  return githubService.getDashboard();
}

/** Forced rebuild for the manual/cron refresh route. */
export async function forceRefreshDashboard(): Promise<DashboardResult> {
  return githubService.refreshDashboard();
}

/** Config + cadence snapshot for the status route (no secrets exposed). */
export function getDashboardStatus(): {
  configured: boolean;
  accounts: string[];
  refreshIntervalKey: string;
  refreshIntervalSeconds: number;
} {
  if (!isDashboardConfigured()) {
    return {
      configured: false,
      accounts: [],
      refreshIntervalKey: '',
      refreshIntervalSeconds: 0,
    };
  }
  const env = getDashboardEnv();
  return {
    configured: true,
    accounts: env.accounts.map((a) => a.key),
    refreshIntervalKey: env.refreshIntervalKey,
    refreshIntervalSeconds: env.refreshIntervalSeconds,
  };
}
