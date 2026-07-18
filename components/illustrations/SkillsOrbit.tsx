'use client';

import { useRef, useState } from 'react';
import { useAnimationFrame, useReducedMotion, motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// A set of orbiting tech icons circling a central hub, representing the breadth
// of skill categories. Two rings rotate in opposite directions at different
// speeds. Positions are computed every frame from elapsed time (rather than
// relying on nested CSS transforms), so each icon travels a true circle
// around the hub without drifting off its ring or colliding with the other
// ring. Palette stays on the warm paper/ink/accent theme used across the
// other hero illustrations.

const RING_BORDER = '#E2D9CB';
const HUB_BG = '#96714F';
const HUB_ACCENT = '#B08968';

type OrbitIcon = { icon: string; angle: number };

const innerRing: OrbitIcon[] = [
  { icon: 'BrainCircuit', angle: 0 },
  { icon: 'Code2', angle: 120 },
  { icon: 'Server', angle: 240 },
];

const outerRing: OrbitIcon[] = [
  { icon: 'Globe', angle: 30 },
  { icon: 'Database', angle: 110 },
  { icon: 'MessageSquare', angle: 190 },
  { icon: 'Smartphone', angle: 270 },
  { icon: 'Search', angle: 330 },
];

const INNER_PERIOD_MS = 22000;
const OUTER_PERIOD_MS = 34000;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function SkillsOrbit() {
  const reduce = useReducedMotion();

  const cx = 160;
  const cy = 160;
  const rInner = 62;
  const rOuter = 118;

  const [innerRotation, setInnerRotation] = useState(0);
  const [outerRotation, setOuterRotation] = useState(0);
  const elapsed = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    elapsed.current += delta;
    setInnerRotation((elapsed.current / INNER_PERIOD_MS) * 360);
    setOuterRotation((-elapsed.current / OUTER_PERIOD_MS) * 360);
  });

  return (
    <svg
      viewBox="0 0 320 320"
      aria-label="Illustration of technology icons orbiting a central hub, representing a range of technical skills"
      className="w-full max-w-sm"
      style={{ overflow: 'visible' }}
    >
      {/* orbit paths */}
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke={RING_BORDER} strokeWidth="1.5" strokeDasharray="4 5" />
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke={RING_BORDER} strokeWidth="1.5" strokeDasharray="4 5" />

      {/* inner ring */}
      {innerRing.map(({ icon, angle }) => {
        const { x, y } = polarToXY(cx, cy, rInner, angle + innerRotation);
        const Icon = (LucideIcons as any)[icon] || LucideIcons.Cpu;
        return (
          <g key={icon}>
            <circle cx={x} cy={y} r="19" fill="#FAF7F2" stroke={RING_BORDER} strokeWidth="1.5" />
            <g transform={`translate(${x - 11}, ${y - 11})`}>
              <Icon size={22} color={HUB_ACCENT} strokeWidth={1.75} />
            </g>
          </g>
        );
      })}

      {/* outer ring */}
      {outerRing.map(({ icon, angle }) => {
        const { x, y } = polarToXY(cx, cy, rOuter, angle + outerRotation);
        const Icon = (LucideIcons as any)[icon] || LucideIcons.Cpu;
        return (
          <g key={icon}>
            <circle cx={x} cy={y} r="16" fill="#FAF7F2" stroke={RING_BORDER} strokeWidth="1.5" />
            <g transform={`translate(${x - 9}, ${y - 9})`}>
              <Icon size={18} color="#7A6A57" strokeWidth={1.75} />
            </g>
          </g>
        );
      })}

      {/* central hub */}
      <motion.g
        animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle cx={cx} cy={cy} r="34" fill={HUB_BG} />
        <circle cx={cx} cy={cy} r="34" fill="none" stroke={HUB_ACCENT} strokeWidth="1.5" />
        <g transform={`translate(${cx - 16}, ${cy - 16})`}>
          <LucideIcons.Sparkles size={32} color="#FAF7F2" strokeWidth={1.5} />
        </g>
      </motion.g>
    </svg>
  );
}
