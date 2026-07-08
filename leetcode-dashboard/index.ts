/**
 * Public entry point for the LeetCode dashboard module.
 *
 * Import from `@/leetcode-dashboard` for the common surface; deep-import
 * (`@/leetcode-dashboard/utils`, `@/leetcode-dashboard/lib`) when you need the
 * pure helpers directly. `components/` and `charts/` are Client Components —
 * import them directly from `@/leetcode-dashboard/components` /
 * `@/leetcode-dashboard/charts` in the page that renders them, rather than
 * through this barrel, so a server-only import here never drags client code
 * (or vice versa) into the wrong bundle.
 *
 * Data-fetching exports below are server-only (they pull in `server-only`
 * transitively) — do not import them from a client component. The `types` and
 * `utils` re-exports are pure and safe on either side.
 */

export * from './types';
export * from './utils';

export {
  LeetcodeService,
  LeetcodeDashboardService,
  leetcodeDashboardService,
  buildDashboard,
} from './services';

export {
  loadDashboard,
  forceRefreshDashboard,
  getDashboardStatus,
} from './api';

export {
  DIFFICULTY_LEVELS,
  DIFFICULTY_COLORS,
  DEFAULT_REFRESH_INTERVAL_SECONDS,
  CACHE_KEYS,
} from './constants';

export { isLeetcodeConfigured } from './constants/env';
