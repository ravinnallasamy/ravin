'use client';

/**
 * GitHub-style calendar heatmap. Accepts a plain date-keyed value map — no
 * LeetCode-specific types imported. Renders a Sun-Sat grid with hover/focus
 * tooltips and a Weekly / Monthly / Yearly range toggle that windows the same
 * underlying map to a shorter trailing period.
 */

import { useMemo, useState } from 'react';

export interface HeatmapCalendarEntry {
  /** ISO date "YYYY-MM-DD". */
  date: string;
  count: number;
}

export type HeatmapRange = 'weekly' | 'monthly' | 'yearly';

interface HeatmapCalendarProps {
  /** Dense, chronologically ordered days (including zero-count days). */
  entries: HeatmapCalendarEntry[];
  /** Inclusive lower bounds for levels 1..4. */
  thresholds: [number, number, number, number];
  levelColors?: [string, string, string, string, string];
  ariaLabel: string;
  defaultRange?: HeatmapRange;
}

const DEFAULT_LEVEL_COLORS: [string, string, string, string, string] = [
  '#ECE4D8',
  '#C8EAE3',
  '#7FD6C2',
  '#2FBBA0',
  '#00b8a3',
];

const RANGE_DAYS: Record<HeatmapRange, number> = {
  weekly: 7 * 7, // trailing 7 weeks
  monthly: 7 * 18, // trailing ~4.5 months
  yearly: 7 * 53, // trailing 53 weeks (full year)
};

const RANGE_OPTIONS: { key: HeatmapRange; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

function levelFor(count: number, thresholds: [number, number, number, number]): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count >= thresholds[3]) return 4;
  if (count >= thresholds[2]) return 3;
  if (count >= thresholds[1]) return 2;
  return 1;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function weekdayOfIso(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

interface Cell {
  x: number;
  y: number;
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function HeatmapCalendar({
  entries,
  thresholds,
  levelColors = DEFAULT_LEVEL_COLORS,
  ariaLabel,
  defaultRange = 'yearly',
}: HeatmapCalendarProps) {
  const [range, setRange] = useState<HeatmapRange>(defaultRange);
  const [activeCell, setActiveCell] = useState<Cell | null>(null);

  const cellSize = range === 'weekly' ? 20 : range === 'monthly' ? 14 : 11;
  const gap = range === 'weekly' ? 4 : 3;

  const { cells, columns, totalInRange } = useMemo(() => {
    const windowDays = RANGE_DAYS[range];
    const windowed = entries.slice(-windowDays);
    if (windowed.length === 0) return { cells: [] as Cell[], columns: 0, totalInRange: 0 };

    const firstWeekday = weekdayOfIso(windowed[0].date);
    const built: Cell[] = windowed.map((entry, i) => {
      const dayIndex = i + firstWeekday;
      return {
        x: Math.floor(dayIndex / 7),
        y: dayIndex % 7,
        date: entry.date,
        count: entry.count,
        level: levelFor(entry.count, thresholds),
      };
    });
    const columns = built.length ? built[built.length - 1].x + 1 : 0;
    const totalInRange = windowed.reduce((sum, e) => sum + e.count, 0);
    return { cells: built, columns, totalInRange };
  }, [entries, range, thresholds]);

  const width = columns * (cellSize + gap);
  const height = 7 * (cellSize + gap);

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-wrap items-center justify-between gap-12">
        <div
          role="tablist"
          aria-label="Heatmap range"
          className="flex gap-4 rounded-full border border-border bg-surface p-4"
        >
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              role="tab"
              type="button"
              aria-selected={range === opt.key}
              onClick={() => setRange(opt.key)}
              className={`rounded-full px-12 py-4 font-mono text-mono-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                range === opt.key ? 'bg-accent text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-mono-label text-ink-faint">
          {totalInRange.toLocaleString()} submissions in range
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg role="img" aria-label={ariaLabel} width={width} height={height} className="min-w-max">
          <title>{ariaLabel}</title>
          {cells.map((cell) => (
            <rect
              key={cell.date}
              x={cell.x * (cellSize + gap)}
              y={cell.y * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={3}
              fill={levelColors[cell.level]}
              tabIndex={0}
              role="button"
              aria-label={`${cell.count} submission${cell.count === 1 ? '' : 's'} on ${formatDate(cell.date)}`}
              onMouseEnter={() => setActiveCell(cell)}
              onMouseLeave={() => setActiveCell(null)}
              onFocus={() => setActiveCell(cell)}
              onBlur={() => setActiveCell(null)}
              className="cursor-default outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent"
            />
          ))}
        </svg>
        {activeCell && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-paper px-8 py-4 text-mono-label font-mono text-ink shadow-md"
            style={{
              left: activeCell.x * (cellSize + gap) + cellSize / 2,
              top: activeCell.y * (cellSize + gap) - 6,
            }}
          >
            {activeCell.count} submission{activeCell.count === 1 ? '' : 's'} · {formatDate(activeCell.date)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 text-mono-label text-ink-faint">
        <span>Less</span>
        {levelColors.map((color, i) => (
          <span key={`${color}-${i}`} className="h-11 w-11 rounded-sm" style={{ backgroundColor: color }} aria-hidden />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
