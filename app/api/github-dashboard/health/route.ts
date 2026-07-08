import { NextResponse, type NextRequest } from 'next/server';

import { checkDeploymentSecurity } from '@/github-dashboard/lib/deploymentCheck';
import { checkTokenHealth } from '@/github-dashboard/lib/tokenHealth';

/**
 * GET /api/github-dashboard/health
 * Internal security/config health check. Full details (which vars are
 * missing, placeholder warnings, token rotation age) are only ever returned
 * for requests that are either non-production or carry the health secret —
 * never to an arbitrary public caller in production. A production caller
 * without the secret gets only a coarse `{ status }`, never variable names.
 */

export const dynamic = 'force-dynamic';

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1', 'localhost']);

function isLoopbackRequest(request: NextRequest): boolean {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    return first ? LOOPBACK_HOSTS.has(first) : false;
  }
  const host = request.headers.get('host')?.split(':')[0];
  return host ? LOOPBACK_HOSTS.has(host) : false;
}

function isAuthorizedForDetails(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') return true;

  const secret = process.env.GITHUB_DASHBOARD_HEALTH_SECRET?.trim();
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth === `Bearer ${secret}`) return true;
  }

  return isLoopbackRequest(request);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const deployment = checkDeploymentSecurity();
  const tokenHealth = checkTokenHealth();

  const degraded =
    !deployment.allVariablesPresent || !deployment.noPlaceholders || tokenHealth.isOverdue;

  if (!isAuthorizedForDetails(request)) {
    return NextResponse.json(
      { status: degraded ? 'degraded' : 'ok' },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      status: degraded ? 'degraded' : 'ok',
      deployment,
      tokenHealth,
    },
    { status: 200 },
  );
}
