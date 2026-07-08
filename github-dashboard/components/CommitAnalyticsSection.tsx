'use client';

import { useMemo, useState } from 'react';
import { Flame, TrendingUp, CalendarDays, CalendarClock } from 'lucide-react';
import { LineAreaChart } from '../charts';
import { bucketsToSeries } from '../utils/graph';
import { DashboardCard } from './DashboardCard';
import type { CommitAggregate, StreakStat, ActivityPeaks } from '../types';

type Granularity = keyof CommitAggregate;

const TABS: { key: Granularity; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

function InsightChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-8 rounded-2xl border border-border/50 bg-surface p-16">
      <span className="text-accent">{icon}</span>
      <div className="flex flex-col">
        <span className="font-display text-h3 text-ink leading-tight">{value}</span>
        <span className="font-mono text-mono-label text-ink-faint">{label}</span>
      </div>
    </div>
  );
}

export function CommitAnalyticsSection({
  commitAggregate,
  streaks,
  peaks,
}: {
  commitAggregate: CommitAggregate;
  streaks: StreakStat;
  peaks: ActivityPeaks;
}) {
  const [granularity, setGranularity] = useState<Granularity>('daily');

  const series = useMemo(() => {
    const buckets = commitAggregate[granularity];
    // Charts stay legible by windowing dense granularities.
    const windowed = granularity === 'daily' ? buckets.slice(-90) : granularity === 'weekly' ? buckets.slice(-52) : buckets;
    return bucketsToSeries(windowed);
  }, [commitAggregate, granularity]);

  const avgPerDay = useMemo(() => {
    const daily = commitAggregate.daily;
    if (daily.length === 0) return 0;
    const total = daily.reduce((acc, b) => acc + b.count, 0);
    return Math.round((total / daily.length) * 10) / 10;
  }, [commitAggregate.daily]);

  return (
    <DashboardCard
      eyebrow="Trends"
      title="Commit Analytics"
      action={
        <div role="tablist" aria-label="Commit chart granularity" className="flex gap-4 rounded-full border border-border bg-surface p-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={granularity === tab.key}
              onClick={() => setGranularity(tab.key)}
              className={`rounded-full px-12 py-4 font-mono text-mono-label transition-colors ${
                granularity === tab.key ? 'bg-accent text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      <LineAreaChart
        data={series}
        valueSuffix="contributions"
        ariaLabel={`Contributions by ${granularity} period`}
      />

      <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
        <InsightChip icon={<TrendingUp size={18} aria-hidden />} label="Avg commits/day" value={String(avgPerDay)} />
        <InsightChip icon={<Flame size={18} aria-hidden />} label="Current streak" value={`${streaks.currentStreakDays}d`} />
        <InsightChip icon={<Flame size={18} aria-hidden />} label="Longest streak" value={`${streaks.longestStreakDays}d`} />
        <InsightChip
          icon={<CalendarDays size={18} aria-hidden />}
          label="Most active day"
          value={peaks.mostActiveDay ? peaks.mostActiveDay.date : '—'}
        />
      </div>
      {peaks.mostActiveMonth && (
        <div className="flex items-center gap-8 text-mono-label text-ink-faint">
          <CalendarClock size={14} aria-hidden />
          <span>
            Most active month: {peaks.mostActiveMonth.label} ({peaks.mostActiveMonth.count} contributions)
          </span>
        </div>
      )}
    </DashboardCard>
  );
}
