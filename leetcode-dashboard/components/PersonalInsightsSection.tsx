/**
 * Derived insight cards. Every value here is computed directly from data
 * already fetched by the other sections — nothing is estimated or fabricated.
 * Each insight only renders when its source data is present.
 */

import { BarChart3, CalendarCheck2, Gauge, Target } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { computeStreaks } from '../utils';
import type { ProblemStats, SubmissionCalendar } from '../types';

interface PersonalInsightsSectionProps {
  problemStats: ProblemStats | null;
  calendar: SubmissionCalendar | null;
}

interface Insight {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}

function difficultyPreference(stats: ProblemStats): Insight | null {
  const withSolves = stats.byDifficulty.filter((d) => d.solved > 0);
  if (withSolves.length === 0) return null;

  const top = withSolves.reduce((best, d) => (d.solved > best.solved ? d : best));
  const share = stats.totalSolved > 0 ? Math.round((top.solved / stats.totalSolved) * 100) : 0;

  return {
    key: 'preference',
    icon: <Target size={18} aria-hidden />,
    label: 'Difficulty preference',
    value: top.difficulty,
    detail: `${share}% of solved problems are ${top.difficulty}`,
  };
}

function distributionBalance(stats: ProblemStats): Insight | null {
  if (stats.totalSolved === 0) return null;
  const parts = stats.byDifficulty.map((d) => `${d.percentage}% ${d.difficulty[0]}`);

  return {
    key: 'balance',
    icon: <BarChart3 size={18} aria-hidden />,
    label: 'Problem distribution',
    value: parts.join(' / '),
    detail: 'Share of solved problems by difficulty',
  };
}

function solvingConsistency(calendar: SubmissionCalendar): Insight {
  const streaks = computeStreaks(calendar);

  return {
    key: 'consistency',
    icon: <CalendarCheck2 size={18} aria-hidden />,
    label: 'Solving consistency',
    value: `${streaks.longestStreakDays}d longest streak`,
    detail: `${calendar.totalActiveDays.toLocaleString()} active days, ${streaks.currentStreakDays}d current streak`,
  };
}

function learningProgress(stats: ProblemStats): Insight | null {
  if (stats.totalAvailable === 0) return null;

  return {
    key: 'progress',
    icon: <Gauge size={18} aria-hidden />,
    label: 'Learning progress',
    value: `${stats.overallPercentage}%`,
    detail: `${stats.totalSolved.toLocaleString()} of ${stats.totalAvailable.toLocaleString()} available problems solved`,
  };
}

export function PersonalInsightsSection({ problemStats, calendar }: PersonalInsightsSectionProps) {
  const insights: Insight[] = [];

  if (problemStats) {
    const pref = difficultyPreference(problemStats);
    if (pref) insights.push(pref);

    const balance = distributionBalance(problemStats);
    if (balance) insights.push(balance);

    const progress = learningProgress(problemStats);
    if (progress) insights.push(progress);
  }

  if (calendar && calendar.days.length > 0) {
    insights.push(solvingConsistency(calendar));
  }

  if (insights.length === 0) return null;

  return (
    <DashboardCard eyebrow="Analysis" title="Personal Insights">
      <div className="grid gap-16 sm:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.key} className="flex min-w-0 items-start gap-12 rounded-2xl border border-border/50 bg-surface p-16">
            <span className="mt-2 shrink-0 text-accent">{insight.icon}</span>
            <div className="flex min-w-0 flex-col gap-4">
              <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">{insight.label}</span>
              <span className="break-words text-body font-medium text-ink">{insight.value}</span>
              <span className="break-words text-mono-label text-ink-faint">{insight.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
