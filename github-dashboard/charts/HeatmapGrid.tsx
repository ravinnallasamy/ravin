'use client';

/**
 * Generic week x weekday intensity grid (GitHub-style calendar heatmap).
 * Accepts plain cells `{ x, y, value, level }` — no GitHub types imported.
 */

import { useState } from 'react';

export interface HeatmapGridCell {
  /** Column index. */
  x: number;
  /** Row index. */
  y: number;
  value: number;
  level: 0 | 1 | 2 | 3 | 4;
  /** Rendered in the cell's tooltip/label. */
  tooltip: string;
}

interface HeatmapGridProps {
  cells: HeatmapGridCell[];
  columns: number;
  rows?: number;
  levelColors?: [string, string, string, string, string];
  cellSize?: number;
  gap?: number;
  ariaLabel: string;
}

const DEFAULT_LEVEL_COLORS: [string, string, string, string, string] = [
  '#ECE4D8',
  '#E8D3B8',
  '#D9A867',
  '#B08968',
  '#7A5A3A',
];

export function HeatmapGrid({
  cells,
  columns,
  rows = 7,
  levelColors = DEFAULT_LEVEL_COLORS,
  cellSize = 11,
  gap = 3,
  ariaLabel,
}: HeatmapGridProps) {
  const [activeCell, setActiveCell] = useState<HeatmapGridCell | null>(null);
  const width = columns * (cellSize + gap);
  const height = rows * (cellSize + gap);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
        className="min-w-max"
      >
        <title>{ariaLabel}</title>
        {cells.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x * (cellSize + gap)}
            y={cell.y * (cellSize + gap)}
            width={cellSize}
            height={cellSize}
            rx={2}
            fill={levelColors[cell.level]}
            tabIndex={0}
            role="button"
            aria-label={cell.tooltip}
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
          {activeCell.tooltip}
        </div>
      )}
    </div>
  );
}
