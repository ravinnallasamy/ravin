'use client';

/** Generic bar chart. Accepts plain `{ x, y }` points, no domain logic. */

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip, type ChartValueFormat } from './ChartTooltip';

export interface BarChartPoint {
  x: string;
  y: number;
}

interface BarChartGenericProps {
  data: BarChartPoint[];
  color?: string;
  height?: number;
  layout?: 'horizontal' | 'vertical';
  valueFormat?: ChartValueFormat;
  valueSuffix?: string;
  ariaLabel: string;
}

export function BarChartGeneric({
  data,
  color = '#B08968',
  height = 240,
  layout = 'horizontal',
  valueFormat,
  valueSuffix,
  ariaLabel,
}: BarChartGenericProps) {
  const isVertical = layout === 'vertical';

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isVertical ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 8, left: isVertical ? 8 : -16, bottom: 0 }}
        >
          <CartesianGrid stroke="#E2D9CB" strokeDasharray="4 4" horizontal={!isVertical} vertical={isVertical} />
          {isVertical ? (
            <>
              <XAxis type="number" tick={{ fill: '#94A0AB', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="x"
                tick={{ fill: '#52606D', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={88}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="x"
                tick={{ fill: '#94A0AB', fontSize: 11 }}
                axisLine={{ stroke: '#E2D9CB' }}
                tickLine={false}
                minTickGap={16}
              />
              <YAxis tick={{ fill: '#94A0AB', fontSize: 11 }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
            </>
          )}
          <Tooltip
            cursor={{ fill: 'rgba(176,137,104,0.08)' }}
            content={<ChartTooltip valueFormat={valueFormat} valueSuffix={valueSuffix} />}
          />
          <Bar dataKey="y" fill={color} radius={isVertical ? [0, 6, 6, 0] : [6, 6, 0, 0]} isAnimationActive animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
