import { DashboardCard } from './DashboardCard';
import type { TimeBucket } from '../types';

function dateKeyDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function sumSince(daily: TimeBucket[], sinceKey: string): number {
  return daily.filter((b) => b.key >= sinceKey).reduce((acc, b) => acc + b.count, 0);
}

function countOnDate(daily: TimeBucket[], key: string): number {
  return daily.find((b) => b.key === key)?.count ?? 0;
}

export function DailyActivitySection({ daily }: { daily: TimeBucket[] }) {
  const today = dateKeyDaysAgo(0);
  const yesterday = dateKeyDaysAgo(1);
  const weekStart = dateKeyDaysAgo(6);
  const monthStart = dateKeyDaysAgo(29);
  const rolling30 = dateKeyDaysAgo(29);
  const rolling365 = dateKeyDaysAgo(364);

  const metrics = [
    { label: 'Today', value: countOnDate(daily, today) },
    { label: 'Yesterday', value: countOnDate(daily, yesterday) },
    { label: 'This week', value: sumSince(daily, weekStart) },
    { label: 'This month', value: sumSince(daily, monthStart) },
    { label: 'Last 30 days', value: sumSince(daily, rolling30) },
    { label: 'Last 365 days', value: sumSince(daily, rolling365) },
  ];

  return (
    <DashboardCard eyebrow="Pulse" title="Daily Activity">
      <div className="grid grid-cols-2 gap-16 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface p-16">
            <span className="font-display text-h2 text-ink">{m.value.toLocaleString()}</span>
            <span className="font-mono text-mono-label text-ink-faint">{m.label}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
