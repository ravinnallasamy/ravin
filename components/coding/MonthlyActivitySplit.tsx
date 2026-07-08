'use client';

/**
 * Shared "month-split calendar" used by BOTH the GitHub and LeetCode dashboards
 * on the /coding page. It renders ONE continuous GitHub-style year calendar
 * (weeks left->right, weekday rows top->bottom) but inserts an empty spacer
 * column between calendar months, so the single calendar reads as month-by-month
 * groups. Month labels run along the top.
 *
 * Each dashboard passes in its own flat list of daily activity ({ date, count })
 * and its own labels/colors. This component is intentionally self-contained — it
 * imports nothing from `github-dashboard/` or `leetcode-dashboard/`, keeping
 * those modules decoupled.
 */

import { useMemo, useState } from 'react';

export interface ActivityDay {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Activity count for that day. */
  count: number;
}

interface MonthlyActivitySplitProps {
  /** Flat list of daily activity. Days with count 0 may be omitted. */
  days: ActivityDay[];
  /** Section eyebrow, e.g. "Activity". */
  eyebrow?: string;
  /** Section title, e.g. "Contributions by Month". */
  title: string;
  /** Noun for the tooltip/summary, e.g. "contribution" / "submission". */
  unitLabel: string;
  /** How many trailing calendar months to show. Default 12. */
  months?: number;
  /** Level 0..4 fill colors. Defaults to the warm GitHub-style ramp. */
  levelColors?: [string, string, string, string, string];
}

const DEFAULT_LEVEL_COLORS: [string, string, string, string, string] = [
  '#ECE4D8',
  '#E8D3B8',
  '#D9A867',
  '#B08968',
  '#7A5A3A',
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

function computeThresholds(maxCount: number): [number, number, number, number] {
  if (maxCount <= 0) return [1, 1, 1, 1];
  if (maxCount <= 4) return [1, 2, 3, 4];
  const q = maxCount / 4;
  return [1, Math.max(2, Math.ceil(q)), Math.max(3, Math.ceil(q * 2)), Math.max(4, Math.ceil(q * 3))];
}

function levelFor(count: number, t: [number, number, number, number]): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count >= t[3]) return 4;
  if (count >= t[2]) return 3;
  if (count >= t[1]) return 2;
  return 1;
}

function isoKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function formatDate(key: string): string {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface Cell {
  x: number;
  y: number;
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface MonthLabel {
  /** X pixel of the month's first column. */
  x: number;
  text: string;
}

interface Grid {
  cells: Cell[];
  monthLabels: MonthLabel[];
  columns: number;
  total: number;
}

/**
 * Walks the trailing `months` calendar months day-by-day, placing each day in a
 * Sun-Sat column. A NEW month starts a fresh column AND leaves a one-column gap
 * before it (except the very first month), so months are visually separated
 * inside one continuous calendar.
 */
function buildGrid(days: ActivityDay[], months: number): Grid {
  const countByDate = new Map<string, number>();
  for (const d of days) {
    if (!d.count) continue;
    countByDate.set(d.date, (countByDate.get(d.date) ?? 0) + d.count);
  }

  const now = new Date();
  // First day of the window: first day of the month `months-1` back, in UTC.
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));
  // Last day of the window: last day of the current month.
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));

  let maxCount = 0;
  for (const key of countByDate.keys()) {
    const v = countByDate.get(key) ?? 0;
    if (v > maxCount) maxCount = v;
  }
  const thresholds = computeThresholds(maxCount);

  const cells: Cell[] = [];
  const monthLabels: MonthLabel[] = [];
  let col = 0;
  let prevMonth = -1;
  let total = 0;

  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    const month = cursor.getUTCMonth();
    const weekday = cursor.getUTCDay();

    // Month boundary: advance to a fresh column and leave one blank gap column
    // (skip the gap for the very first month, and don't gap if we're already at
    // a clean column start from a prior wrap).
    if (month !== prevMonth) {
      if (prevMonth !== -1) {
        col += weekday === 0 ? 1 : 2; // gap column, +1 more if mid-week to start fresh
      }
      monthLabels.push({ x: col * STEP, text: MONTH_SHORT[month] });
      prevMonth = month;
    } else if (weekday === 0) {
      // Sunday within the same month starts a new week column.
      col += 1;
    }

    const key = isoKey(cursor);
    const count = countByDate.get(key) ?? 0;
    total += count;
    cells.push({ x: col, y: weekday, date: key, count, level: levelFor(count, thresholds) });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return { cells, monthLabels, columns: col + 1, total };
}

export function MonthlyActivitySplit({
  days,
  eyebrow = 'Activity',
  title,
  unitLabel,
  months = 12,
  levelColors = DEFAULT_LEVEL_COLORS,
}: MonthlyActivitySplitProps) {
  const grid = useMemo(() => buildGrid(days, months), [days, months]);
  const [active, setActive] = useState<Cell | null>(null);

  const labelH = 16;
  const gridH = 7 * STEP;
  const width = grid.columns * STEP;
  const height = labelH + gridH;

  return (
    <div className="flex flex-col gap-16 rounded-3xl border border-border/60 bg-paper p-24 shadow-neu md:p-32">
      <div className="flex items-start justify-between gap-16">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">{eyebrow}</span>
          <h3 className="font-display text-h3 text-ink">{title}</h3>
        </div>
        <span className="font-mono text-mono-label text-ink-faint">
          {grid.total.toLocaleString()} {unitLabel}s
        </span>
      </div>

      {grid.total === 0 ? (
        <p className="text-body text-ink-muted">No activity in the last {months} months.</p>
      ) : (
        <>
          <div className="relative w-full overflow-x-auto">
            <svg
              role="img"
              aria-label={`${title}: ${grid.total} ${unitLabel}s, split month by month`}
              width={width}
              height={height}
              className="min-w-max"
            >
              <title>{`${title}: ${grid.total} ${unitLabel}s`}</title>
              {grid.monthLabels.map((m, i) => (
                <text
                  key={`${m.text}-${i}`}
                  x={m.x}
                  y={11}
                  className="fill-ink-faint font-mono"
                  style={{ fontSize: 10 }}
                >
                  {m.text}
                </text>
              ))}
              {grid.cells.map((cell) => (
                <rect
                  key={`${cell.x}-${cell.y}-${cell.date}`}
                  x={cell.x * STEP}
                  y={labelH + cell.y * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={levelColors[cell.level]}
                  tabIndex={0}
                  role="button"
                  aria-label={`${cell.count} ${unitLabel}${cell.count === 1 ? '' : 's'} on ${formatDate(cell.date)}`}
                  onMouseEnter={() => setActive(cell)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(cell)}
                  onBlur={() => setActive(null)}
                  className="cursor-default outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent"
                />
              ))}
            </svg>
            {active && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-paper px-8 py-4 font-mono text-mono-label text-ink shadow-md"
                style={{
                  left: active.x * STEP + CELL / 2,
                  top: labelH + active.y * STEP - 6,
                }}
              >
                {active.count} {unitLabel}{active.count === 1 ? '' : 's'} · {formatDate(active.date)}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-4 font-mono text-mono-label text-ink-faint">
            <span>Less</span>
            {levelColors.map((color) => (
              <span key={color} className="h-11 w-11 rounded-sm" style={{ backgroundColor: color }} aria-hidden />
            ))}
            <span>More</span>
          </div>
        </>
      )}
    </div>
  );
}
