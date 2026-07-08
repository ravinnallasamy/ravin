import { HeatmapGrid, type HeatmapGridCell } from '../charts';
import { DashboardCard } from './DashboardCard';
import { EmptySectionState } from './DashboardStatus';
import type { Heatmap } from '../types';

const LEVEL_COLORS: [string, string, string, string, string] = [
  '#ECE4D8',
  '#E8D3B8',
  '#D9A867',
  '#B08968',
  '#7A5A3A',
];

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function ContributionHeatmapSection({ heatmap, totalContributions }: { heatmap: Heatmap; totalContributions: number }) {
  if (heatmap.cells.length === 0) {
    return (
      <DashboardCard eyebrow="Activity" title="Contribution Calendar">
        <EmptySectionState message="No contribution data available yet." />
      </DashboardCard>
    );
  }

  const cells: HeatmapGridCell[] = heatmap.cells.map((cell) => ({
    x: cell.week,
    y: cell.weekday,
    value: cell.count,
    level: cell.level,
    tooltip: `${cell.count} contribution${cell.count === 1 ? '' : 's'} on ${formatDate(cell.date)}`,
  }));

  return (
    <DashboardCard
      eyebrow="Activity"
      title="Contribution Calendar"
      action={
        <span className="font-mono text-mono-label text-ink-faint">
          {totalContributions.toLocaleString()} contributions
        </span>
      }
    >
      <HeatmapGrid
        cells={cells}
        columns={heatmap.weeks}
        levelColors={LEVEL_COLORS}
        ariaLabel={`Merged contribution calendar, ${totalContributions} total contributions`}
      />
      <div className="flex items-center justify-end gap-4 text-mono-label text-ink-faint">
        <span>Less</span>
        {LEVEL_COLORS.map((color) => (
          <span key={color} className="h-11 w-11 rounded-sm" style={{ backgroundColor: color }} aria-hidden />
        ))}
        <span>More</span>
      </div>
    </DashboardCard>
  );
}
