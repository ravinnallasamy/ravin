/**
 * Server-side data accessors ("hooks" in the data-access sense — these run in
 * Server Components, mirroring the repo's `lib/*` getter convention, NOT React
 * client hooks). The UI phase calls these from async server components; they
 * never expose tokens and never throw.
 */

import { loadDashboard, getDashboardStatus } from '../api';
import type { DashboardResult, MergedDashboard } from '../types';

/** Full merged dashboard result (ok/partial/failure discriminated). */
export async function useDashboardData(): Promise<DashboardResult> {
  return loadDashboard();
}

/**
 * Convenience accessor that returns the merged data or null on total failure,
 * matching the repo's existing "degrade to null" idiom (see lib/github.ts).
 * Partial data (one account down) is still returned; inspect `data.meta`.
 */
export async function useDashboardOrNull(): Promise<MergedDashboard | null> {
  const result = await loadDashboard();
  return result.ok ? result.data : null;
}

/** Non-sensitive configuration/cadence status for the UI to display. */
export function useDashboardStatus(): ReturnType<typeof getDashboardStatus> {
  return getDashboardStatus();
}
