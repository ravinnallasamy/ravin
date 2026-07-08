'use client';

import dynamic from 'next/dynamic';
import { Trophy } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { SkeletonChart } from './Skeleton';
import { toRatingTrend } from '../utils/chart';
import type { ContestData } from '../types';

const LineChart = dynamic(() => import('../charts/LineChart').then((m) => m.LineChart), {
  ssr: false,
  loading: () => <SkeletonChart height={220} />,
});

function formatContestDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Contest data hides entirely (returns null) rather than rendering an empty
 * state — per spec, non-competitors simply never see this section.
 */
export function ContestAnalyticsSection({ contest }: { contest: ContestData | null }) {
  if (!contest) return null;

  const trend = toRatingTrend(contest);
  const chartData = trend.points.map((p) => ({ x: formatContestDate(p.date), y: Math.round(p.rating) }));

  return (
    <DashboardCard eyebrow="Competitive" title="Contest Analytics">
      <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
        <Stat label="Current rating" value={Math.round(contest.ranking.rating).toLocaleString()} />
        <Stat label="Highest rating" value={Math.round(contest.highestRating).toLocaleString()} />
        <Stat label="Global rank" value={`#${contest.ranking.globalRanking.toLocaleString()}`} />
        <Stat label="Contests attended" value={contest.ranking.attendedContestsCount.toLocaleString()} />
      </div>

      {chartData.length > 1 && (
        <LineChart data={chartData} ariaLabel="Contest rating trend over time" valueSuffix="rating" />
      )}

      {contest.history.length > 0 && (
        <div className="flex flex-col gap-8">
          <h4 className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">Contest history</h4>
          <ul className="flex flex-col gap-4">
            {[...contest.history].reverse().slice(0, 10).map((c) => (
              <li
                key={`${c.title}-${c.startTimestamp}`}
                className="flex flex-wrap items-center justify-between gap-8 rounded-xl border border-border/40 bg-surface px-16 py-12"
              >
                <span className="flex items-center gap-8 text-body text-ink">
                  <Trophy size={14} className="text-accent" aria-hidden />
                  {c.title}
                </span>
                <span className="flex items-center gap-16 font-mono text-mono-label text-ink-faint">
                  <span>Rank #{c.ranking.toLocaleString()}</span>
                  <span>{Math.round(c.rating)} rating</span>
                  <span>{formatContestDate(c.startTime)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface p-16">
      <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">{label}</span>
      <span className="text-body font-medium text-ink">{value}</span>
    </div>
  );
}
