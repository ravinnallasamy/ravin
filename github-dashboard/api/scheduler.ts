import 'server-only';

/**
 * Scheduled refresh driver.
 *
 * Two mechanisms cover "never fetch on every request", used together:
 *
 *  1. ISR / Next revalidate — every GitHub fetch passes `revalidate:
 *     refreshIntervalSeconds`, and the route handlers set the same
 *     `revalidate`, so Next serves cached responses between windows.
 *
 *  2. This in-process interval timer — for long-lived (Node) server runtimes,
 *     it proactively rebuilds the merged snapshot on the configured cadence so
 *     the first request after a window is already warm. It is a no-op-safe
 *     singleton: starting twice does nothing, and it self-guards against
 *     serverless environments where background timers don't persist.
 *
 * The canonical way to trigger scheduled refreshes in a serverless deploy is an
 * external cron hitting `POST /api/github-dashboard/refresh` (see route). This
 * timer is the convenience path for `next start` / a persistent Node host.
 */

import { githubService } from '../services';
import { getDashboardEnv, isDashboardConfigured } from '../constants/env';

interface SchedulerState {
  timer: ReturnType<typeof setInterval> | null;
  startedAt: number | null;
  lastRunAt: number | null;
  running: boolean;
}

const globalForScheduler = globalThis as unknown as {
  __githubDashboardScheduler?: SchedulerState;
};

const state: SchedulerState =
  globalForScheduler.__githubDashboardScheduler ??
  (globalForScheduler.__githubDashboardScheduler = {
    timer: null,
    startedAt: null,
    lastRunAt: null,
    running: false,
  });

/** Runs one refresh, guarding against overlap. Never throws. */
export async function runScheduledRefresh(): Promise<void> {
  if (state.running) return; // don't stack refreshes
  state.running = true;
  try {
    const result = await githubService.refreshDashboard();
    state.lastRunAt = Date.now();
    if (!result.ok) {
      console.error(
        `[github-dashboard] scheduled refresh failed: ${result.error.message}`,
      );
    }
  } finally {
    state.running = false;
  }
}

/**
 * Starts the interval timer if configured and not already running. Idempotent.
 * Returns true if the timer is active after the call.
 */
export function startScheduler(): boolean {
  if (!isDashboardConfigured()) return false;
  if (state.timer) return true;

  const { refreshIntervalSeconds } = getDashboardEnv();
  const intervalMs = refreshIntervalSeconds * 1000;

  state.timer = setInterval(() => {
    void runScheduledRefresh();
  }, intervalMs);
  // Don't keep the process alive solely for this timer.
  state.timer.unref?.();
  state.startedAt = Date.now();
  return true;
}

/** Stops the timer (test/shutdown). */
export function stopScheduler(): void {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
    state.startedAt = null;
  }
}

/** Read-only scheduler status for the status route. */
export function getSchedulerStatus(): {
  active: boolean;
  startedAt: number | null;
  lastRunAt: number | null;
} {
  return {
    active: state.timer !== null,
    startedAt: state.startedAt,
    lastRunAt: state.lastRunAt,
  };
}
