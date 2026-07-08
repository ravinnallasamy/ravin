'use client';

import dynamic from 'next/dynamic';
import { DashboardCard } from './DashboardCard';
import { SkeletonChart } from './Skeleton';
import { CHART_PALETTE } from '../charts';
import { toTopicBars } from '../utils/chart';
import type { TopicStats } from '../types';

const PieChart = dynamic(() => import('../charts/PieChart').then((m) => m.PieChart), {
  ssr: false,
  loading: () => <SkeletonChart height={240} />,
});
const BarChart = dynamic(() => import('../charts/BarChart').then((m) => m.BarChart), {
  ssr: false,
  loading: () => <SkeletonChart height={280} />,
});

/** Topic distribution hides entirely when unavailable, per spec. */
export function TopicDistributionSection({ topics }: { topics: TopicStats | null }) {
  if (!topics) return null;

  const top10 = toTopicBars(topics, 10);
  const pieData = top10.map((t, i) => ({ label: t.name, value: t.problemsSolved, color: CHART_PALETTE[i % CHART_PALETTE.length] }));
  const barData = top10.map((t, i) => ({ x: t.name, y: t.problemsSolved, color: CHART_PALETTE[i % CHART_PALETTE.length] }));

  return (
    <DashboardCard eyebrow="Skills" title="Topic Distribution" action={<span className="font-mono text-mono-label text-ink-faint">Top 10 of {topics.all.length}</span>}>
      <div className="grid gap-24 md:grid-cols-2">
        <PieChart data={pieData} ariaLabel="Top 10 topics by problems solved" />
        <BarChart
          data={barData}
          layout="vertical"
          height={Math.max(200, barData.length * 32)}
          ariaLabel="Top 10 topics by problems solved, bar view"
        />
      </div>
    </DashboardCard>
  );
}
