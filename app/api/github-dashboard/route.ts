import { NextResponse } from 'next/server';

import { loadDashboard } from '@/github-dashboard/api';
import { getDashboardEnv, isDashboardConfigured } from '@/github-dashboard/constants/env';

/**
 * GET /api/github-dashboard
 * Returns the cache-first merged dashboard. Never fetches per request beyond
 * the configured revalidate window. Degrades gracefully:
 *  - not configured -> 503
 *  - total failure   -> 502 with the error
 *  - partial/success -> 200 (partial flagged in `data.meta`)
 */

// Static ISR ceiling for this route segment (Next requires a literal here,
// so it can't read GITHUB_REFRESH_INTERVAL directly). The real cadence is
// enforced below by readThrough()'s cache TTL, driven by refreshIntervalSeconds
// from env — GitHub is only ever called once per that window regardless of
// this value. The Cache-Control header sent below carries the true interval.
export const revalidate = 21_600;
export const dynamic = 'force-static';

export async function GET(): Promise<NextResponse> {
  if (!isDashboardConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'GitHub dashboard is not configured' },
      { status: 503 },
    );
  }

  const result = await loadDashboard();

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  const { refreshIntervalSeconds } = getDashboardEnv();
  return NextResponse.json(result, {
    status: 200,
    headers: {
      'Cache-Control': `public, s-maxage=${refreshIntervalSeconds}, stale-while-revalidate`,
    },
  });
}
