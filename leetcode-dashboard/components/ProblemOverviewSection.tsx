'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { DashboardCard } from './DashboardCard';
import { RadialProgress } from '../charts';
import { toDifficultyProgress } from '../utils/chart';
import type { ProblemStats } from '../types';

function DifficultyBar({
  difficulty,
  solved,
  total,
  percentage,
  color,
}: {
  difficulty: string;
  solved: number;
  total: number;
  percentage: number;
  color: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between text-mono-label">
        <span className="font-medium text-ink">{difficulty}</span>
        <span className="text-ink-faint">
          {solved.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-8 w-full overflow-hidden rounded-full bg-surface-raised">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={shouldReduceMotion ? { width: `${percentage}%` } : { width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function ProblemOverviewSection({ stats }: { stats: ProblemStats }) {
  const progress = toDifficultyProgress(stats);

  return (
    <DashboardCard eyebrow="Overview" title="Problem Solving">
      <div className="grid gap-24 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex flex-col items-center gap-8 justify-self-center">
          <RadialProgress
            value={stats.overallPercentage}
            size={128}
            strokeWidth={10}
            label={`${stats.overallPercentage}%`}
            ariaLabel={`${stats.overallPercentage}% of all problems solved`}
          />
          <span className="font-mono text-mono-label text-ink-faint">Overall completion</span>
        </div>

        <div className="flex flex-col gap-16">
          <div className="flex items-baseline gap-8">
            <span className="font-display text-h1 text-ink">
              <AnimatedCounter value={stats.totalSolved} />
            </span>
            <span className="text-body text-ink-muted">/ {stats.totalAvailable.toLocaleString()} solved</span>
          </div>

          <div className="flex flex-col gap-16">
            {progress.map((d) => (
              <DifficultyBar
                key={d.difficulty}
                difficulty={d.difficulty}
                solved={d.solved}
                total={d.total}
                percentage={d.percentage}
                color={d.color}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
