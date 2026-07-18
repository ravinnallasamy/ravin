'use client';

import dynamic from 'next/dynamic';
import { DashboardCard } from './DashboardCard';
import { SkeletonChart } from './Skeleton';
import { toDifficultySlices } from '../utils/chart';
import type { ProblemStats } from '../types';

const PieChart = dynamic(() => import('../charts/PieChart').then((m) => m.PieChart), {
  ssr: false,
  loading: () => <SkeletonChart height={240} />,
});
const BarChart = dynamic(() => import('../charts/BarChart').then((m) => m.BarChart), {
  ssr: false,
  loading: () => <SkeletonChart height={240} />,
});

export function DifficultyDistributionSection({ stats }: { stats: ProblemStats }) {
  const slices = toDifficultySlices(stats);
  const pieData = slices.map((s) => ({ label: s.difficulty, value: s.value, color: s.color }));
  const barData = slices.map((s) => ({ x: s.difficulty, y: s.value, color: s.color }));

  return (
    <DashboardCard eyebrow="Breakdown" title="Difficulty Distribution">
      <div className="grid gap-24 md:grid-cols-2">
        <PieChart data={pieData} ariaLabel="Problems solved by difficulty" />
        <BarChart data={barData} ariaLabel="Problems solved by difficulty, bar view" />
      </div>
      <ul className="grid grid-cols-3 gap-8">
        {slices.map((s) => (
          <li key={s.difficulty} className="flex min-w-0 flex-col items-center gap-4 rounded-2xl border border-border/50 bg-surface p-8 text-center sm:p-16">
            <span className="h-8 w-8 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
            <span className="font-mono text-mono-label text-ink-faint">{s.difficulty}</span>
            <span className="font-display text-h3 text-ink">{s.percentage}%</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
