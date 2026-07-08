'use client';

/**
 * Generic time-series area/line chart. Zero GitHub-specific logic — accepts
 * plain `{ x, y }` points (see utils/graph.ts `SeriesPoint`).
 */

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip, type ChartValueFormat } from './ChartTooltip';

export interface LineAreaChartPoint {
  x: string;
  y: number;
}

interface LineAreaChartProps {
  data: LineAreaChartPoint[];
  color?: string;
  height?: number;
  valueFormat?: ChartValueFormat;
  valueSuffix?: string;
  ariaLabel: string;
}

export function LineAreaChart({
  data,
  color = '#B08968',
  height = 240,
  valueFormat,
  valueSuffix,
  ariaLabel,
}: LineAreaChartProps) {
  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="lineAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E2D9CB" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fill: '#94A0AB', fontSize: 11 }}
            axisLine={{ stroke: '#E2D9CB' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: '#94A0AB', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip valueFormat={valueFormat} valueSuffix={valueSuffix} />} />
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            fill="url(#lineAreaFill)"
            isAnimationActive
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
