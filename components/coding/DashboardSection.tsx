import { Suspense, type ReactNode } from 'react';

/**
 * Shared page-level wrapper for a dashboard block on the /coding page.
 *
 * Both the GitHub and LeetCode blocks share the same shell: if the dashboard is
 * configured, render its async content inside a wide container behind a Suspense
 * boundary with a skeleton fallback; otherwise render its unconfigured state in a
 * narrower container. This component owns that repeated shell so each dashboard's
 * call site is a single line.
 *
 * It renders whatever each dashboard module gives it (content / skeleton /
 * unconfigured node) as opaque children — it never imports from
 * `github-dashboard/` or `leetcode-dashboard/`, keeping those modules isolated.
 */
export function DashboardSection({
  id,
  configured,
  content,
  skeleton,
  unconfigured,
}: {
  id?: string;
  configured: boolean;
  /** The async dashboard content element (rendered inside Suspense). */
  content: ReactNode;
  /** Fallback shown while `content` streams in. */
  skeleton: ReactNode;
  /** Shown instead of content when `configured` is false. */
  unconfigured: ReactNode;
}) {
  if (!configured) {
    return (
      <div id={id} className="mx-auto w-full max-w-5xl px-16 py-48 sm:px-20 md:px-24 md:py-64 scroll-mt-24">
        {unconfigured}
      </div>
    );
  }

  return (
    <div id={id} className="mx-auto w-full max-w-6xl px-16 py-48 sm:px-20 md:px-24 md:py-64 scroll-mt-24">
      <Suspense fallback={skeleton}>{content}</Suspense>
    </div>
  );
}
