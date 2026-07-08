/**
 * Public entry point for the GitHub dashboard module.
 *
 * Import from `@/github-dashboard` for the common surface; deep-import
 * (`@/github-dashboard/utils`, `@/github-dashboard/lib`) when you need the
 * pure helpers directly. Components/ and charts/ arrive in the next phase.
 */

export * from './types';
export { githubService, GitHubService } from './services';
export {
  loadDashboard,
  forceRefreshDashboard,
  getDashboardStatus,
} from './api';
export {
  useDashboardData,
  useDashboardOrNull,
  useDashboardStatus,
} from './hooks';
export { REFRESH_INTERVALS, DEFAULT_REFRESH_INTERVAL } from './constants';
export { isDashboardConfigured } from './constants/env';
