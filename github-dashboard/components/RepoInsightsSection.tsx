import { DashboardCard } from './DashboardCard';
import { EmptySectionState } from './DashboardStatus';
import type { Repository } from '../types';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function InsightRow({ label, repo, detail }: { label: string; repo: Repository | undefined; detail: string }) {
  if (!repo) return null;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface p-16">
      <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">{label}</span>
      <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="font-display text-h3 text-ink hover:text-accent">
        {repo.name}
      </a>
      <span className="text-mono-label text-ink-faint">{detail}</span>
    </div>
  );
}

export function RepoInsightsSection({ repositories }: { repositories: Repository[] }) {
  if (repositories.length === 0) {
    return (
      <DashboardCard eyebrow="Highlights" title="Repository Insights">
        <EmptySectionState message="No repositories to analyze yet." />
      </DashboardCard>
    );
  }

  const mostStarred = repositories.slice().sort((a, b) => b.stargazers - a.stargazers)[0];
  const mostActive = repositories
    .slice()
    .filter((r) => r.pushedAt)
    .sort((a, b) => Date.parse(b.pushedAt as string) - Date.parse(a.pushedAt as string))[0];
  // No historical star-delta data is captured, so "fastest growing" uses
  // stars-per-day-since-creation as the best available proxy.
  const fastestGrowing = repositories
    .slice()
    .filter((r) => r.stargazers > 0)
    .sort((a, b) => {
      const rateA = a.stargazers / Math.max(1, daysSince(a.createdAt));
      const rateB = b.stargazers / Math.max(1, daysSince(b.createdAt));
      return rateB - rateA;
    })[0];
  const newest = repositories.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
  const oldest = repositories.slice().sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))[0];
  const recentlyUpdated = repositories.slice().sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];

  return (
    <DashboardCard eyebrow="Highlights" title="Repository Insights">
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
        <InsightRow label="Most starred" repo={mostStarred} detail={`${mostStarred.stargazers} stars`} />
        <InsightRow label="Most active" repo={mostActive} detail={`Pushed ${formatDate(mostActive?.pushedAt ?? null)}`} />
        <InsightRow
          label="Fastest growing"
          repo={fastestGrowing}
          detail={fastestGrowing ? `${fastestGrowing.stargazers} stars since ${formatDate(fastestGrowing.createdAt)}` : ''}
        />
        <InsightRow label="Newest" repo={newest} detail={`Created ${formatDate(newest.createdAt)}`} />
        <InsightRow label="Oldest" repo={oldest} detail={`Created ${formatDate(oldest.createdAt)}`} />
        <InsightRow label="Recently updated" repo={recentlyUpdated} detail={`Updated ${formatDate(recentlyUpdated.updatedAt)}`} />
      </div>
    </DashboardCard>
  );
}

function daysSince(iso: string): number {
  return Math.max(1, Math.round((Date.now() - Date.parse(iso)) / (1000 * 60 * 60 * 24)));
}
