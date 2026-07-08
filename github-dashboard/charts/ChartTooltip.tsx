'use client';

/**
 * Shared Recharts tooltip content, styled to match the site's card surfaces.
 *
 * `valueFormat` is a serializable format kind rather than a function prop —
 * Server Components can't pass functions to Client Components, so formatting
 * is resolved here instead of accepted as a callback.
 */

export type ChartValueFormat = 'number' | 'percent' | 'bytes';

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { name?: string; value?: number | string; color?: string }[];
  valueFormat?: ChartValueFormat;
  valueSuffix?: string;
}

export function formatChartValue(value: number | string, format: ChartValueFormat = 'number'): string {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);

  switch (format) {
    case 'percent':
      return `${num}%`;
    case 'bytes':
      return `${num.toLocaleString()} bytes`;
    case 'number':
    default:
      return num.toLocaleString();
  }
}

export function ChartTooltip({ active, label, payload, valueFormat, valueSuffix }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-paper px-12 py-8 text-mono-label font-mono shadow-md">
      {label && <div className="mb-4 text-ink-faint">{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-8 text-ink">
          {entry.color && (
            <span
              className="inline-block h-8 w-8 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
          )}
          <span>
            {entry.name ? `${entry.name}: ` : ''}
            {entry.value !== undefined ? formatChartValue(entry.value, valueFormat) : ''}
            {entry.value !== undefined && valueSuffix ? ` ${valueSuffix}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
