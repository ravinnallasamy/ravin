'use client';

/**
 * Generic circular progress/gauge. Accepts a plain 0-100 value. Single source of
 * truth for BOTH dashboard modules (each re-exports this file).
 */

interface RadialProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  ariaLabel: string;
}

export function RadialProgress({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  color = '#B08968',
  trackColor = '#ECE4D8',
  label,
  ariaLabel,
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const offset = circumference * (1 - ratio);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
        />
      </svg>
      {label && (
        <span className="absolute font-display text-h3 text-ink">{label}</span>
      )}
    </div>
  );
}
