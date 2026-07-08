import { NextResponse } from 'next/server';

import { loadDashboard } from '@/leetcode-dashboard/api';
import {
  getLeetcodeEnv,
  isLeetcodeConfigured,
} from '@/leetcode-dashboard/constants/env';

/**
 * GET /api/leetcode-dashboard
 * Returns the cache-first merged dashboard. Never fetches per request beyond
 * the configured revalidate window. Degrades gracefully:
 *  - not configured -> 503
 *  - configured     -> 200 (per-section failures flagged in `data.meta`)
 */

// Static ISR ceiling for this route segment (Next requires a literal here, so
// it can't read LEETCODE_REFRESH_INTERVAL directly). The real cadence is
// enforced by the cache TTL below, driven by refreshIntervalSeconds from env —
// LeetCode is only ever called once per that window regardless of this value.
// The Cache-Control header carries the true interval.
export const revalidate = 21_600;
export const dynamic = 'force-static';

export async function GET(): Promise<NextResponse> {
  if (!isLeetcodeConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'LeetCode dashboard is not configured' },
      { status: 503 },
    );
  }

  const result = await loadDashboard();

  if (!result.ok) {
    // Only reached when the username can't be resolved / user not found.
    const status = result.kind === 'not-found' ? 404 : 502;
    return NextResponse.json(result, { status });
  }

  const { refreshIntervalSeconds } = getLeetcodeEnv();
  return NextResponse.json(result, {
    status: 200,
    headers: {
      'Cache-Control': `public, s-maxage=${refreshIntervalSeconds}, stale-while-revalidate`,
    },
  });
}
