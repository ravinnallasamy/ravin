import { NextResponse } from 'next/server';

import { getDashboardStatus } from '@/github-dashboard/api';
import { getSchedulerStatus } from '@/github-dashboard/api/scheduler';

/**
 * GET /api/github-dashboard/status
 * Non-sensitive health/config snapshot (no tokens, no usernames beyond the
 * account keys). Useful for debugging and for the UI to show "last refreshed".
 */

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ...getDashboardStatus(),
      scheduler: getSchedulerStatus(),
    },
    { status: 200 },
  );
}
