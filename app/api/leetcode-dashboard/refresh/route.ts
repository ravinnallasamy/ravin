import { NextResponse, type NextRequest } from 'next/server';

import { forceRefreshDashboard } from '@/leetcode-dashboard/api';
import { isLeetcodeConfigured } from '@/leetcode-dashboard/constants/env';

/**
 * POST /api/leetcode-dashboard/refresh
 * Forces a rebuild and overwrites the cache. Intended for an external cron
 * (Vercel Cron, GitHub Actions, etc.) to drive scheduled refreshes in a
 * serverless deploy, complementing the in-process timer.
 *
 * Protected by a bearer secret: set LEETCODE_DASHBOARD_REFRESH_SECRET and send
 * `Authorization: Bearer <secret>`. If the secret is unset, the endpoint is
 * disabled (403) rather than left open.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.LEETCODE_DASHBOARD_REFRESH_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'Refresh endpoint disabled: no secret configured' },
      { status: 403 },
    );
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  if (!isLeetcodeConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'LeetCode dashboard is not configured' },
      { status: 503 },
    );
  }

  const result = await forceRefreshDashboard();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
