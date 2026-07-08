import { DashboardCard } from './DashboardCard';
import type { RecentSubmission } from '../types';

/**
 * LeetCode's public `recentAcSubmissionList` query does not return difficulty
 * per submission (verified in Phase 1 research), so no difficulty badge is
 * shown here — showing one would mean fabricating data the API doesn't give.
 */

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSeconds = Math.max(0, Math.round((now - then) / 1000));

  if (diffSeconds < 60) return 'just now';
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Recent activity hides entirely when there's nothing to show, per spec. */
export function RecentActivitySection({ recent }: { recent: RecentSubmission[] | null }) {
  if (!recent || recent.length === 0) return null;

  return (
    <DashboardCard eyebrow="Activity" title="Recent Activity">
      <ul className="flex flex-col gap-4">
        {recent.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-8 rounded-xl border border-border/40 bg-surface px-16 py-12">
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-accent"
            >
              {r.title}
            </a>
            <span className="flex items-center gap-12 font-mono text-mono-label text-ink-faint">
              <span>{formatRelative(r.date)}</span>
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
