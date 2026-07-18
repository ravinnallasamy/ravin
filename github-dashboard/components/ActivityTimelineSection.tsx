import {
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  GitPullRequest,
  CircleDot,
  Star,
  Building2,
  PackagePlus,
  Activity,
} from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { EmptySectionState } from './DashboardStatus';
import type { ActivityEvent } from '../types';

const EVENT_ICON: Record<string, React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>> = {
  PushEvent: GitCommitHorizontal,
  PullRequestEvent: GitPullRequest,
  CreateEvent: PackagePlus,
  IssuesEvent: CircleDot,
  IssueCommentEvent: CircleDot,
  ReleaseEvent: PackagePlus,
  ForkEvent: GitFork,
  WatchEvent: Star,
  OrganizationEvent: Building2,
  PublicEvent: GitBranch,
};

const EVENT_LABEL: Record<string, string> = {
  PushEvent: 'Pushed to',
  PullRequestEvent: 'Pull request on',
  CreateEvent: 'Created',
  IssuesEvent: 'Issue on',
  IssueCommentEvent: 'Commented on',
  ReleaseEvent: 'Released on',
  ForkEvent: 'Forked',
  WatchEvent: 'Starred',
  OrganizationEvent: 'Organization event on',
  PublicEvent: 'Made public',
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export function ActivityTimelineSection({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <DashboardCard eyebrow="Timeline" title="Recent Activity">
        <EmptySectionState message="No recent activity to show." />
      </DashboardCard>
    );
  }

  const visible = events.slice(0, 25);

  return (
    <DashboardCard eyebrow="Timeline" title="Recent Activity">
      <ol className="flex flex-col gap-16">
        {visible.map((event) => {
          const Icon = EVENT_ICON[event.type] ?? Activity;
          const label = EVENT_LABEL[event.type] ?? event.type;
          return (
            <li key={event.id} className="flex items-start gap-12 border-l-2 border-border/60 pl-16">
              <span className="mt-2 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                <Icon size={14} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="break-words text-body text-ink">
                  {label} <span className="font-medium">{event.repoName}</span>
                </span>
                <span className="font-mono text-mono-label text-ink-faint">
                  {formatWhen(event.createdAt)} · {event.sourceAccount}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </DashboardCard>
  );
}
