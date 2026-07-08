/**
 * Server-side data accessors ("hooks" in the data-access sense — these run in
 * Server Components, mirroring the repo's `lib/*` getter convention and the
 * sibling github-dashboard/hooks/useDashboardData.ts, NOT React client hooks).
 */

import { loadDashboard, getDashboardStatus } from '../api';
import type { DashboardResult, LeetcodeDashboard } from '../types';

/** Full dashboard result (ok/failure discriminated). */
export async function useDashboardData(): Promise<DashboardResult> {
  return loadDashboard();
}

/**
 * Convenience accessor that returns the dashboard or null on total failure,
 * matching the repo's existing "degrade to null" idiom (see lib/github.ts).
 */
export async function useDashboardOrNull(): Promise<LeetcodeDashboard | null> {
  const result = await loadDashboard();
  return result.ok ? result.data : null;
}

/** Non-sensitive configuration/cadence status for the UI to display. */
export function useDashboardStatus(): ReturnType<typeof getDashboardStatus> {
  return getDashboardStatus();
}
