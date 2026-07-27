'use client';

import dynamic from 'next/dynamic';
import { Flame } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { NotPubliclyAvailableState } from './DashboardStatus';
import { SkeletonChart } from './Skeleton';
import { buildHeatmap, computeStreaks } from '../utils';
import type { SubmissionCalendar } from '../types';

const HeatmapCalendar = dynamic(
  () => import('../charts/HeatmapCalendar').then((m) => m.HeatmapCalendar),
  { ssr: false, loading: () => <SkeletonChart height={140} /> },
);

interface SubmissionHeatmapSectionProps {
  calendar: SubmissionCalendar | null;
  unavailable: boolean;
}

export function SubmissionHeatmapSection({ calendar, unavailable }: SubmissionHeatmapSectionProps) {
  if (unavailable || !calendar) {
    return (
      <DashboardCard eyebrow="Activity" title="Submission Heatmap">
        <NotPubliclyAvailableState message="Submission calendar isn't publicly available for this user." />
      </DashboardCard>
    );
  }

  const heatmap = buildHeatmap(calendar);
  const streaks = computeStreaks(calendar);
  const entries = heatmap.cells.map((c) => ({ date: c.date, count: c.count }));

  return (
    <DashboardCard
      eyebrow="Activity"
      title="Submission Heatmap"
      action={
        <span className="inline-flex items-center gap-4 font-mono text-mono-label text-ink-faint">
          <Flame size={14} className="text-accent" aria-hidden />
          {streaks.currentStreakDays}d current streak
        </span>
      }
    >
      <HeatmapCalendar
        entries={entries}
        thresholds={heatmap.thresholds}
        ariaLabel={`Submission calendar, ${calendar.totalSubmissions} total submissions`}
        defaultRange="yearly"
      />
      <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
        <Stat label="Total submissions" value={calendar.totalSubmissions.toLocaleString()} />
        <Stat label="Active days" value={calendar.totalActiveDays.toLocaleString()} />
        <Stat label="Current streak" value={`${streaks.currentStreakDays}d`} />
        <Stat label="Longest streak" value={`${streaks.longestStreakDays}d`} />
      </div>
    </DashboardCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface p-16">
      <span className="font-mono text-mono-label uppercase text-ink-faint">{label}</span>
      <span className="text-body font-medium text-ink">{value}</span>
    </div>
  );
}
