import { NextResponse } from 'next/server';

import { getDashboardStatus } from '@/leetcode-dashboard/api';
import { getSchedulerStatus } from '@/leetcode-dashboard/api/scheduler';

/**
 * GET /api/leetcode-dashboard/status
 * Non-sensitive health/config snapshot (username + cadence + scheduler state).
 * Useful for debugging and for the UI to show "last refreshed". No secrets
 * exist in this module, so nothing sensitive is exposed.
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
