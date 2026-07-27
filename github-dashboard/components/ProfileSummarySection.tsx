import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import type { LanguageStat, Repository, CommitAggregate } from '../types';

function countCreatedThisYear(repos: Repository[]): number {
  const year = new Date().getUTCFullYear();
  return repos.filter((r) => new Date(r.createdAt).getUTCFullYear() === year).length;
}

function countUpdatedThisMonth(repos: Repository[]): number {
  const now = new Date();
  return repos.filter((r) => {
    const updated = new Date(r.updatedAt);
    return updated.getUTCFullYear() === now.getUTCFullYear() && updated.getUTCMonth() === now.getUTCMonth();
  }).length;
}

function trend(weekly: CommitAggregate['weekly']): { direction: 'up' | 'down' | 'flat'; deltaPct: number } {
  if (weekly.length < 2) return { direction: 'flat', deltaPct: 0 };
  const last = weekly[weekly.length - 1].count;
  const prev = weekly[weekly.length - 2].count;
  if (prev === 0) return { direction: last > 0 ? 'up' : 'flat', deltaPct: last > 0 ? 100 : 0 };
  const deltaPct = Math.round(((last - prev) / prev) * 100);
  return { direction: deltaPct > 0 ? 'up' : deltaPct < 0 ? 'down' : 'flat', deltaPct };
}

function avgWeekly(weekly: CommitAggregate['weekly']): number {
  if (weekly.length === 0) return 0;
  const total = weekly.reduce((acc, w) => acc + w.count, 0);
  return Math.round((total / weekly.length) * 10) / 10;
}

export function ProfileSummarySection({
  languages,
  repositories,
  commitAggregate,
}: {
  languages: LanguageStat[];
  repositories: Repository[];
  commitAggregate: CommitAggregate;
}) {
  const topLanguage = languages[0]?.name ?? '—';
  const favoriteStack = languages.slice(0, 3).map((l) => l.name).join(', ') || '—';
  const createdThisYear = countCreatedThisYear(repositories);
  const updatedThisMonth = countUpdatedThisMonth(repositories);
  const { direction, deltaPct } = trend(commitAggregate.weekly);
  const weeklyAvg = avgWeekly(commitAggregate.weekly);

  const TrendIcon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  const trendColor = direction === 'up' ? 'text-success' : direction === 'down' ? 'text-signal' : 'text-ink-faint';

  const items = [
    { label: 'Top language', value: topLanguage },
    { label: 'Favorite stack', value: favoriteStack },
    { label: 'Repos created this year', value: String(createdThisYear) },
    { label: 'Repos updated this month', value: String(updatedThisMonth) },
    { label: 'Avg weekly activity', value: `${weeklyAvg} / week` },
  ];

  return (
    <DashboardCard eyebrow="Overview" title="Profile Summary">
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface p-16">
            <span className="font-mono text-mono-label uppercase text-ink-faint">{item.label}</span>
            <span className="text-body font-medium text-ink">{item.value}</span>
          </div>
        ))}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface p-16">
          <span className="font-mono text-mono-label uppercase text-ink-faint">Contribution trend</span>
          <span className={`inline-flex items-center gap-4 text-body font-medium ${trendColor}`}>
            <TrendIcon size={16} aria-hidden />
            {direction === 'flat' ? 'Steady' : `${Math.abs(deltaPct)}% ${direction === 'up' ? 'up' : 'down'} week over week`}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
