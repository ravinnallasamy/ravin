'use client';

/** Generic donut/pie chart. Accepts plain labelled slices, no domain logic. */

import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltip, type ChartValueFormat } from './ChartTooltip';

export interface PieChartSlice {
  label: string;
  value: number;
  color?: string;
}

const PALETTE = [
  '#B08968',
  '#96714F',
  '#D2C5AF',
  '#52606D',
  '#B45309',
  '#15803D',
  '#94A0AB',
  '#1E2A3A',
];

interface PieChartProps {
  data: PieChartSlice[];
  height?: number;
  valueFormat?: ChartValueFormat;
  valueSuffix?: string;
  ariaLabel: string;
}

export function PieChart({ data, height = 240, valueFormat, valueSuffix, ariaLabel }: PieChartProps) {
  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            isAnimationActive
            animationDuration={600}
          >
            {data.map((slice, i) => (
              <Cell key={slice.label} fill={slice.color ?? PALETTE[i % PALETTE.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip valueFormat={valueFormat} valueSuffix={valueSuffix} />} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

export { PALETTE as CHART_PALETTE };
