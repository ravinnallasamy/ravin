import 'server-only';

/**
 * Module-internal API layer: the thin functions Next.js route handlers (and
 * server components) call. Keeps route handlers dumb and testable, and ensures
 * the background scheduler starts on first server access.
 */

import { leetcodeDashboardService } from '../services';
import { getLeetcodeEnv, isLeetcodeConfigured } from '../constants/env';
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
  return leetcodeDashboardService.getDashboard();
}

/** Forced rebuild for the manual/cron refresh route. */
export async function forceRefreshDashboard(): Promise<DashboardResult> {
  return leetcodeDashboardService.refreshDashboard();
}

/** Config + cadence snapshot for the status route (no secrets exposed). */
export function getDashboardStatus(): {
  configured: boolean;
  username: string;
  refreshIntervalSeconds: number;
} {
  if (!isLeetcodeConfigured()) {
    return { configured: false, username: '', refreshIntervalSeconds: 0 };
  }
  const env = getLeetcodeEnv();
  return {
    configured: true,
    username: env.username,
    refreshIntervalSeconds: env.refreshIntervalSeconds,
  };
}
