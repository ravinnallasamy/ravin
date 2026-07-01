'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

// A civil engineer directs a crane that stacks floors onto a building.
// Blocks rise one by one, the crane arm swings, and the engineer reviews blueprints.
// Color palette stays on the warm paper/ink/accent theme.

const SKY = '#F3EEE6';
const GROUND = '#ECE4D8';
const CRANE = '#96714F';
const CRANE_ACCENT = '#B08968';
const BUILDING_BASE = '#D2C5AF';
const FLOOR_1 = '#E2D9CB';
const FLOOR_2 = '#ECE4D8';
const FLOOR_3 = '#F0E6D8';
const WINDOW = '#AED6F1';
const ENGINEER_SKIN = '#F5CBA7';
const ENGINEER_VEST = '#B08968';
const ENGINEER_HAT = '#F4B400';
const ENGINEER_PANTS = '#52606D';
const INK = '#1E2A3A';
const INK_MUTED = '#52606D';
const BUBBLE_BG = '#FAF7F2';
const BUBBLE_BORDER = '#E2D9CB';

export function BuildingSite() {
  const reduce = useReducedMotion();

  const hook: Variants = {
    rest: { y: 0 },
    drop: reduce
      ? { y: 0 }
      : {
          y: [-46, 6, 6, -46],
          transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', times: [0, 0.35, 0.65, 1] },
        },
  };

  const craneArm: Variants = {
    rest: { rotate: 0 },
    swing: reduce
      ? { rotate: 0 }
      : {
          rotate: [-4, 4, -4],
          transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        },
  };

  const floor1: Variants = {
    hidden: { y: -60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.6, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] } },
  };
  const floor2: Variants = {
    hidden: { y: -60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 1.5, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] } },
  };
  const floor3: Variants = {
    hidden: { y: -60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 2.4, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] } },
  };

  const bubble: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 3.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } },
  };

  const armSway: Variants = {
    rest: { rotate: 0 },
    sway: reduce
      ? { rotate: 0 }
      : { rotate: [0, -6, 0], transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } },
  };

  return (
    <svg
      viewBox="0 0 320 340"
      aria-label="Cartoon civil engineer directing a crane that stacks floors onto a building under construction"
      className="w-full max-w-sm"
      style={{ overflow: 'visible' }}
    >
      {/* ── Sky + ground ── */}
      <rect x="0" y="0" width="320" height="260" fill={SKY} />
      <rect x="0" y="260" width="320" height="80" fill={GROUND} />
      <rect x="0" y="256" width="320" height="6" fill={BUILDING_BASE} />

      {/* ── Crane ── */}
      <g>
        {/* mast */}
        <rect x="248" y="60" width="10" height="196" fill={CRANE} />
        {/* mast lattice */}
        <path d="M248 70 L258 80 M248 90 L258 100 M248 110 L258 120 M248 130 L258 140 M248 150 L258 160 M248 170 L258 180 M248 190 L258 200"
          stroke={CRANE_ACCENT} strokeWidth="2" />
        {/* base */}
        <rect x="236" y="252" width="34" height="10" rx="2" fill={CRANE} />

        {/* rotating jib arm */}
        <motion.g
          style={{ transformOrigin: '253px 60px', transformBox: 'fill-box' }}
          variants={craneArm}
          initial="rest"
          animate="swing"
        >
          {/* counter jib (short back arm) */}
          <rect x="200" y="55" width="53" height="7" fill={CRANE} />
          <circle cx="205" cy="58" r="7" fill={CRANE_ACCENT} />
          {/* main jib (long front arm) */}
          <rect x="253" y="55" width="110" height="7" fill={CRANE} />
          {/* tie cables */}
          <path d="M253 60 L215 90 M253 60 L340 92" stroke={CRANE_ACCENT} strokeWidth="1.5" fill="none" />

          {/* trolley + cable + hook, hangs from tip of jib */}
          <motion.g variants={hook} initial="rest" animate="drop">
            <rect x="330" y="58" width="8" height="8" fill={CRANE} />
            <line x1="334" y1="66" x2="334" y2="100" stroke={INK_MUTED} strokeWidth="1.5" />
            <path d="M328 100 h12 v6 a6 6 0 0 1 -12 0 z" fill={CRANE_ACCENT} />
          </motion.g>
        </motion.g>
      </g>

      {/* ── Building base (ground floor, static) ── */}
      <rect x="60" y="210" width="130" height="50" fill={BUILDING_BASE} />
      <rect x="72" y="222" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
      <rect x="100" y="222" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
      <rect x="128" y="222" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
      <rect x="156" y="222" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
      {/* doorway */}
      <rect x="112" y="238" width="20" height="22" rx="2" fill={INK_MUTED} opacity="0.5" />

      {/* ── Floors that rise in one by one ── */}
      <motion.g variants={floor1} initial="hidden" animate="visible">
        <rect x="60" y="170" width="130" height="40" fill={FLOOR_1} />
        <rect x="60" y="170" width="130" height="40" fill="none" stroke={BUILDING_BASE} strokeWidth="1.5" />
        <rect x="72" y="180" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="100" y="180" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="128" y="180" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="156" y="180" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
      </motion.g>

      <motion.g variants={floor2} initial="hidden" animate="visible">
        <rect x="60" y="130" width="130" height="40" fill={FLOOR_2} />
        <rect x="60" y="130" width="130" height="40" fill="none" stroke={BUILDING_BASE} strokeWidth="1.5" />
        <rect x="72" y="140" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="100" y="140" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="128" y="140" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="156" y="140" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
      </motion.g>

      <motion.g variants={floor3} initial="hidden" animate="visible">
        <rect x="60" y="90" width="130" height="40" fill={FLOOR_3} />
        <rect x="60" y="90" width="130" height="40" fill="none" stroke={BUILDING_BASE} strokeWidth="1.5" />
        <rect x="72" y="100" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="100" y="100" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="128" y="100" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        <rect x="156" y="100" width="16" height="20" rx="1.5" fill={WINDOW} opacity="0.7" />
        {/* rooftop rail */}
        <rect x="60" y="88" width="130" height="4" fill={BUILDING_BASE} />
      </motion.g>

      {/* ── Engineer character (foreground, with blueprint) ── */}
      <g>
        {/* shadow */}
        <ellipse cx="200" cy="286" rx="30" ry="6" fill={BUILDING_BASE} opacity="0.5" />

        {/* legs */}
        <rect x="188" y="256" width="12" height="30" rx="5" fill={ENGINEER_PANTS} />
        <rect x="204" y="256" width="12" height="30" rx="5" fill={ENGINEER_PANTS} />
        {/* boots */}
        <ellipse cx="194" cy="286" rx="9" ry="4.5" fill={INK} />
        <ellipse cx="210" cy="286" rx="9" ry="4.5" fill={INK} />

        {/* body / hi-vis vest */}
        <rect x="180" y="212" width="44" height="48" rx="10" fill={ENGINEER_VEST} />
        <rect x="180" y="212" width="44" height="48" rx="10" fill="none" stroke={CRANE} strokeWidth="1.5" />
        {/* reflective vest stripes */}
        <rect x="184" y="224" width="36" height="4" fill="#FAF7F2" opacity="0.85" />
        <rect x="184" y="240" width="36" height="4" fill="#FAF7F2" opacity="0.85" />

        {/* left arm holding blueprint, gentle sway */}
        <motion.g style={{ transformOrigin: '182px 222px', transformBox: 'fill-box' }} variants={armSway} initial="rest" animate="sway">
          <path d="M182 222 Q162 226 155 236" fill="none" stroke={ENGINEER_VEST} strokeWidth="11" strokeLinecap="round" />
          <circle cx="153" cy="238" r="7" fill={ENGINEER_SKIN} />
          {/* blueprint sheet */}
          <rect x="128" y="222" width="30" height="22" rx="2" fill="#FAF7F2" stroke={BUBBLE_BORDER} strokeWidth="1.2" transform="rotate(-8 143 233)" />
          <path d="M133 228 h20 M133 233 h16 M133 238 h20" stroke={CRANE_ACCENT} strokeWidth="1" transform="rotate(-8 143 233)" />
        </motion.g>

        {/* right arm, pointing up toward crane */}
        <path d="M222 222 Q236 210 244 196" fill="none" stroke={ENGINEER_VEST} strokeWidth="11" strokeLinecap="round" />
        <circle cx="246" cy="193" r="7" fill={ENGINEER_SKIN} />

        {/* neck */}
        <rect x="195" y="200" width="12" height="14" rx="4" fill={ENGINEER_SKIN} />

        {/* head */}
        <ellipse cx="201" cy="192" rx="22" ry="22" fill={ENGINEER_SKIN} />

        {/* eyes */}
        <circle cx="194" cy="192" r="2.3" fill={INK} />
        <circle cx="208" cy="192" r="2.3" fill={INK} />

        {/* smile */}
        <path d="M193 200 Q201 206 209 200" stroke={CRANE} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* hard hat */}
        <path d="M180 188 Q201 160 222 188 Z" fill={ENGINEER_HAT} stroke={CRANE} strokeWidth="1.2" />
        <rect x="178" y="186" width="46" height="6" rx="3" fill={ENGINEER_HAT} stroke={CRANE} strokeWidth="1.2" />
      </g>

      {/* ── Speech bubble ── */}
      <motion.g
        variants={bubble}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: '265px 150px', transformBox: 'fill-box' }}
      >
        <rect x="222" y="118" width="96" height="60" rx="12" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        <path d="M246 178 L238 192 L262 178 Z" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        <path d="M248 178 L256 178" stroke={BUBBLE_BG} strokeWidth="3" />

        <text x="270" y="139" textAnchor="middle" fontSize="10" fontFamily="var(--font-display)" fill={INK} fontWeight="600">
          Building
        </text>
        <text x="270" y="153" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          my track record,
        </text>
        <text x="270" y="166" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          one commit at a time
        </text>
      </motion.g>
    </svg>
  );
}
