'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

// A round coffee table sits between two chairs under a large, full-canopy tree.
// The tree grows in, its shadow settles on the ground, leaves drift down from the
// canopy, and the table + chairs assemble beneath it. Warm paper/ink/accent palette.

const TREE_TRUNK = '#7C5B3D';
const TREE_TRUNK_DARK = '#5E4530';
const TREE_LEAVES = '#A9835C';
const TREE_LEAVES_MID = '#BE9A72';
const TREE_LEAVES_LIGHT = '#D3B88F';
const CHAIR = '#D2C5AF';
const CHAIR_DARK = '#C0AF92';
const CHAIR_SHADOW = '#B08968';
const TABLE_TOP = '#E2D9CB';
const TABLE_TOP_DARK = '#D3C6AE';
const TABLE_LEG = '#8A6748';
const TABLE_LEG_LIGHT = '#A9835C';
const CUP = '#FAF7F2';
const CUP_SHADOW = '#E2D9CB';
const COFFEE = '#7C5B3D';
const STEAM = '#C9A57C';
const INK = '#1E2A3A';
const INK_MUTED = '#52606D';
const BUBBLE_BG = '#FAF7F2';
const BUBBLE_BORDER = '#E2D9CB';
const LEAF_FALL_A = '#B45309';
const LEAF_FALL_B = '#C9711A';
const FOG = '#FFFFFF';

// Each leaf spawns from a point along the canopy's own rendered outline, in
// final canvas coordinates (the canopy is nested in several transforms, so
// these were computed through that chain — see the transform math on the
// canopy group below). This keeps every leaf visibly detaching from a lobe
// of foliage instead of materializing in empty space. `fall` is how far the
// leaf travels straight down before looping back to its start.
const LEAF_DROPS = [
  { x: 72.8, y: 84.3, delay: 0.4, duration: 4.2, drift: 22, fall: 230 },
  { x: 253.1, y: 111.6, delay: 2.1, duration: 4.6, drift: -20, fall: 235 },
  { x: 179.2, y: 146.3, delay: 3.4, duration: 4, drift: 14, fall: 215 },
  { x: 105.3, y: 111.6, delay: 1.3, duration: 4.4, drift: -16, fall: 225 },
  { x: 218.4, y: 132.7, delay: 4.4, duration: 4.1, drift: 18, fall: 220 },
  { x: 140, y: 132.7, delay: 2.8, duration: 4.3, drift: -12, fall: 245 },
];

export function CoffeeTable() {
  const reduce = useReducedMotion();

  const leafFall = (drift: number, duration: number, delay: number, fall: number): Variants => ({
    rest: { y: 0, x: 0, opacity: 0, rotate: 0 },
    fall: reduce
      ? { y: 0, x: 0, opacity: 0, rotate: 0 }
      : {
          y: [0, fall * 0.08, fall * 0.6, fall * 0.9, fall],
          x: [0, drift * 0.3, drift * 0.7, drift * 0.9, drift],
          opacity: [0, 1, 1, 1, 0],
          rotate: [0, -50, 70, 130, 160],
          transition: { repeat: Infinity, duration, delay, ease: 'easeIn', times: [0, 0.08, 0.6, 0.9, 1] },
        },
  });

  const treeGrow: Variants = {
    hidden: { scale: 0.85, opacity: 0, y: 12 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const shadowGrow: Variants = {
    hidden: { scaleX: 0.4, opacity: 0 },
    visible: { scaleX: 1, opacity: 1, transition: { delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const chairRise = (delay: number, dir: 1 | -1): Variants => ({
    hidden: { y: 24, opacity: 0, rotate: dir * 4 },
    visible: { y: 0, opacity: 1, rotate: 0, transition: { delay, duration: 0.7, ease: [0.34, 1.4, 0.64, 1] } },
  });

  const tableRise: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.92 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { delay: 0.55, duration: 0.7, ease: [0.34, 1.4, 0.64, 1] } },
  };

  const cupDrop: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 1.1, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] } },
  };

  const cupDropRight: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 1.4, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] } },
  };

  const bubble: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 1.9, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } },
  };

  const swayLeft: Variants = {
    rest: { rotate: 0 },
    sway: reduce
      ? { rotate: 0 }
      : { rotate: [0, -1.2, 0], transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' } },
  };

  const swayRight: Variants = {
    rest: { rotate: 0 },
    sway: reduce
      ? { rotate: 0 }
      : { rotate: [0, 1, 0], transition: { repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 0.3 } },
  };

  const canopySway: Variants = {
    rest: { rotate: 0 },
    sway: reduce
      ? { rotate: 0 }
      : { rotate: [0, 0.6, 0, -0.6, 0], transition: { repeat: Infinity, duration: 8, ease: 'easeInOut' } },
  };

  const steam = (delay: number): Variants => ({
    rest: { y: 0, opacity: 0.6 },
    rise: reduce
      ? { y: 0, opacity: 0.6 }
      : { y: [-2, -10], opacity: [0.6, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeOut', delay } },
  });

  const fogDrift = (delay: number, duration: number, distance: number): Variants => ({
    rest: { x: -distance / 2, opacity: 0 },
    drift: reduce
      ? { x: 0, opacity: 0.35 }
      : {
          x: [-distance / 2, distance / 2, -distance / 2],
          opacity: [0, 0.4, 0.4, 0],
          transition: { repeat: Infinity, duration, delay, ease: 'easeInOut' },
        },
  });

  // Single cohesive canopy silhouette (one path, scalloped edge) instead of
  // overlapping translucent ellipses — avoids visible seam/ring artifacts.
  // Wide, rounded crown that sits above the trunk (bottom edge ~y=176),
  // leaving the trunk clearly visible down to the chairs/table.
  const canopyPath =
    'M160 22 ' +
    'C180 22 196 32 203 47 ' +
    'C219 45 234 54 240 68 ' +
    'C255 71 266 85 265 100 ' +
    'C279 107 284 123 275 137 ' +
    'C279 150 271 163 255 168 ' +
    'C252 179 240 187 226 186 ' +
    'C220 195 208 201 195 200 ' +
    'C188 206 176 209 160 209 ' +
    'C144 209 132 206 125 200 ' +
    'C112 201 100 195 94 186 ' +
    'C80 187 68 179 65 168 ' +
    'C49 163 41 150 45 137 ' +
    'C36 123 41 107 55 100 ' +
    'C54 85 65 71 80 68 ' +
    'C86 54 101 45 117 47 ' +
    'C124 32 140 22 160 22 Z';

  return (
    <svg
      viewBox="-50 -60 380 450"
      aria-label="A round coffee table with two chairs beneath a large full tree, leaves gently falling, two cups of coffee settling onto the table"
      className="w-full max-w-sm"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="canopyGradient" cx="42%" cy="32%" r="70%">
          <stop offset="0%" stopColor={TREE_LEAVES_LIGHT} />
          <stop offset="55%" stopColor={TREE_LEAVES_MID} />
          <stop offset="100%" stopColor={TREE_LEAVES} />
        </radialGradient>
        <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CHAIR_SHADOW} stopOpacity="0.38" />
          <stop offset="70%" stopColor={CHAIR_SHADOW} stopOpacity="0.16" />
          <stop offset="100%" stopColor={CHAIR_SHADOW} stopOpacity="0" />
        </radialGradient>
        <clipPath id="canopyClip">
          <path d={canopyPath} />
        </clipPath>
        <linearGradient id="tableSheen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Soft ground shadow beneath the whole scene (no hard-edged band) ── */}
      <motion.ellipse
        cx="160"
        cy="334"
        rx="132"
        ry="26"
        fill="url(#groundShadow)"
        variants={shadowGrow}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: '160px 334px' }}
      />

      {/* ── Large full-canopy tree, centered, growing in ── */}
      {/* Stretched taller from the trunk's base (y=312, ground level) so the
          canopy sits well above the table/chairs without moving where the
          trunk meets the ground. */}
      <motion.g variants={treeGrow} initial="hidden" animate="visible" style={{ transformOrigin: '160px 260px' }}>
        <g transform="translate(160 312) scale(1 1.35) translate(-160 -312)">
          {/* trunk, centered under the canopy, extending down to meet the
              table top surface (y=270) without passing behind/under it */}
          <path
            d="M151 270 C150 240 148 200 152 168 C154 148 157 126 160 100 C163 126 166 148 168 168 C172 200 170 240 169 270 Z"
            fill={TREE_TRUNK}
          />
          {/* bark texture lines */}
          <path d="M155 262 C154 230 154 200 157 176" stroke={TREE_TRUNK_DARK} strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M163 264 C162 232 161 200 159 176" stroke={TREE_TRUNK_DARK} strokeWidth="2" fill="none" opacity="0.4" />

          {/* main branches, tucked just inside the canopy's lower edge */}
          <g stroke={TREE_TRUNK} strokeLinecap="round" fill="none">
            <path d="M160 130 C144 114 126 100 108 92" strokeWidth="6" />
            <path d="M160 130 C176 114 194 100 212 92" strokeWidth="6" />
            <path d="M160 112 C156 90 152 70 148 52" strokeWidth="5" />
            <path d="M160 112 C164 90 168 70 172 52" strokeWidth="5" />
          </g>

          {/* ── Canopy: one cohesive scalloped silhouette with radial shading ── */}
          <motion.g variants={canopySway} initial="rest" animate="sway" style={{ transformOrigin: '160px 55px' }}>
            <g transform="translate(0 -40) scale(1.12)">
              <path d={canopyPath} fill="url(#canopyGradient)" />

              {/* interior depth shading, clipped to the silhouette so no seams poke out */}
              <g clipPath="url(#canopyClip)" opacity="0.5">
                <ellipse cx="125" cy="75" rx="52" ry="42" fill={TREE_LEAVES_LIGHT} opacity="0.5" />
                <ellipse cx="205" cy="112" rx="46" ry="38" fill={TREE_TRUNK} opacity="0.12" />
                <ellipse cx="150" cy="160" rx="68" ry="34" fill={TREE_TRUNK} opacity="0.14" />
              </g>

              {/* light leaf-cluster texture strokes for detail, also clipped */}
              <g clipPath="url(#canopyClip)" stroke={TREE_TRUNK_DARK} strokeWidth="1" fill="none" opacity="0.18">
                <path d="M70 68 q11 -8 21 0 t21 0" />
                <path d="M165 46 q11 -6 21 0 t20 3" />
                <path d="M92 145 q12 -6 22 0 t21 -1" />
                <path d="M170 150 q11 -8 21 0" />
                <path d="M120 100 q12 -8 22 0 t21 1" />
              </g>
            </g>
          </motion.g>
        </g>
      </motion.g>

      {/* ── Falling leaves, positioned directly in final canvas coordinates
          along the rendered canopy's lower/side edge so each one visibly
          peels off the foliage and falls straight down past the trunk.
          Each leaf's spawn point is a plain (non-motion) <g> translate —
          Framer Motion's animated x/y are CSS transforms that fully replace
          an element's own `transform` attribute rather than composing with
          it, so the falling motion is applied to a nested motion.path
          instead, relative to this static anchor. ── */}
      {LEAF_DROPS.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) scale(0.55)`}>
          <motion.path
            d="M0 0 C4 -4 10 -4 12 2 C13 7 9 12 3 12 C-1 12 -2 4 0 0 Z"
            fill={i % 2 === 0 ? LEAF_FALL_A : LEAF_FALL_B}
            stroke={TREE_TRUNK_DARK}
            strokeWidth="0.5"
            strokeOpacity="0.3"
            variants={leafFall(leaf.drift, leaf.duration, leaf.delay, leaf.fall)}
            initial="rest"
            animate="fall"
          />
        </g>
      ))}

      {/* ── Left chair, seat facing right toward the table so it faces the
          right chair across it; backrest sits on the outer (left) side ── */}
      <motion.g variants={chairRise(0.7, -1)} initial="hidden" animate="visible">
        <motion.g variants={swayLeft} initial="rest" animate="sway" style={{ transformOrigin: '126px 313px' }}>
          <g transform="translate(-20 8)">
            <ellipse cx="112" cy="309" rx="20" ry="5" fill={CHAIR_SHADOW} opacity="0.26" />
            {/* backrest with slats, set to the outer/left edge so the seat opens toward the table */}
            <rect x="83" y="230" width="24" height="34" rx="8" fill={CHAIR} />
            <rect x="83" y="230" width="24" height="34" rx="8" fill="none" stroke={CHAIR_SHADOW} strokeWidth="1.5" />
            <rect x="89" y="237" width="4" height="22" rx="2" fill={CHAIR_DARK} opacity="0.6" />
            <rect x="97" y="237" width="4" height="22" rx="2" fill={CHAIR_DARK} opacity="0.6" />
            {/* seat with visible thickness, top aligned with the table top height */}
            <rect x="83" y="260" width="42" height="10" rx="4" fill={CHAIR} />
            <rect x="83" y="266" width="42" height="4" rx="2" fill={CHAIR_DARK} />
            {/* legs, flush against the underside of the seat, matched to table-top height */}
            <rect x="87" y="270" width="6" height="39" rx="3" fill={TABLE_LEG} />
            <rect x="116" y="270" width="6" height="39" rx="3" fill={TABLE_LEG} />
          </g>
        </motion.g>
      </motion.g>

      {/* ── Right chair, seat facing left toward the table so the two chairs
          face each other; backrest sits on the outer (right) side ── */}
      <motion.g variants={chairRise(0.85, 1)} initial="hidden" animate="visible">
        <motion.g variants={swayRight} initial="rest" animate="sway" style={{ transformOrigin: '234px 313px' }}>
          <g transform="translate(-20 8)">
            <ellipse cx="248" cy="309" rx="20" ry="5" fill={CHAIR_SHADOW} opacity="0.26" />
            {/* backrest with slats, set to the outer/right edge so the seat opens toward the table */}
            <rect x="253" y="230" width="24" height="34" rx="8" fill={CHAIR} />
            <rect x="253" y="230" width="24" height="34" rx="8" fill="none" stroke={CHAIR_SHADOW} strokeWidth="1.5" />
            <rect x="259" y="237" width="4" height="22" rx="2" fill={CHAIR_DARK} opacity="0.6" />
            <rect x="267" y="237" width="4" height="22" rx="2" fill={CHAIR_DARK} opacity="0.6" />
            {/* seat with visible thickness, top aligned with the table top height */}
            <rect x="235" y="260" width="42" height="10" rx="4" fill={CHAIR} />
            <rect x="235" y="266" width="42" height="4" rx="2" fill={CHAIR_DARK} />
            {/* legs, flush against the underside of the seat, matched to table-top height */}
            <rect x="239" y="270" width="6" height="39" rx="3" fill={TABLE_LEG} />
            <rect x="268" y="270" width="6" height="39" rx="3" fill={TABLE_LEG} />
          </g>
        </motion.g>
      </motion.g>

      {/* ── Table, in the foreground, in front of and lower than both chairs
          for a clear 3D "camera looking slightly down" read ── */}
      <motion.g variants={tableRise} initial="hidden" animate="visible">
        <ellipse cx="160" cy="352" rx="66" ry="14" fill={TABLE_LEG} opacity="0.22" />
        {/* pedestal base, flared foot */}
        <ellipse cx="160" cy="344" rx="26" ry="7" fill={TABLE_LEG} />
        <path d="M152 344 L156 274 h8 L164 344 Z" fill={TABLE_LEG} />
        <path d="M152 344 L156 274 h4 L158 344 Z" fill={TABLE_LEG_LIGHT} opacity="0.5" />
        {/* tabletop, wide ellipse with visible edge thickness, drawn on top so
            it clearly sits in front of the chairs and their legs */}
        <ellipse cx="160" cy="278" rx="70" ry="22" fill={TABLE_TOP_DARK} />
        <ellipse cx="160" cy="270" rx="70" ry="22" fill={TABLE_TOP} stroke={CHAIR_SHADOW} strokeWidth="1.5" />
        <ellipse cx="160" cy="270" rx="70" ry="22" fill="url(#tableSheen)" />

        {/* left cup, moved toward the left chair's side of the table */}
        <motion.g variants={cupDrop} initial="hidden" animate="visible">
          <ellipse cx="124" cy="264" rx="14" ry="4.5" fill={CUP_SHADOW} opacity="0.6" />
          <path d="M113 257 h22 v9 a11 6.5 0 0 1 -22 0 z" fill={CUP} stroke={CUP_SHADOW} strokeWidth="1" />
          <ellipse cx="124" cy="257" rx="11" ry="3.4" fill={COFFEE} />
          <path d="M135 259 q7 0 7 4.5 t-7 4.5" fill="none" stroke={CUP_SHADOW} strokeWidth="1.5" />
          <motion.path
            variants={steam(0)}
            initial="rest"
            animate="rise"
            d="M122 251 q2 -3 0 -6"
            fill="none"
            stroke={STEAM}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* right cup, moved toward the right chair's side of the table */}
        <motion.g variants={cupDropRight} initial="hidden" animate="visible">
          <ellipse cx="196" cy="264" rx="14" ry="4.5" fill={CUP_SHADOW} opacity="0.6" />
          <path d="M185 257 h22 v9 a11 6.5 0 0 1 -22 0 z" fill={CUP} stroke={CUP_SHADOW} strokeWidth="1" />
          <ellipse cx="196" cy="257" rx="11" ry="3.4" fill={COFFEE} />
          <path d="M207 259 q7 0 7 4.5 t-7 4.5" fill="none" stroke={CUP_SHADOW} strokeWidth="1.5" />
          <motion.path
            variants={steam(0.7)}
            initial="rest"
            animate="rise"
            d="M194 251 q2 -3 0 -6"
            fill="none"
            stroke={STEAM}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>

      {/* ── Drifting fog, low near the ground, gently blown by the breeze ── */}
      <g style={{ filter: 'blur(6px)' }}>
        <motion.ellipse
          cx="90" cy="300" rx="60" ry="14" fill={FOG}
          variants={fogDrift(0, 9, 30)} initial="rest" animate="drift"
        />
        <motion.ellipse
          cx="220" cy="308" rx="70" ry="16" fill={FOG}
          variants={fogDrift(1.5, 10.5, 34)} initial="rest" animate="drift"
        />
        <motion.ellipse
          cx="160" cy="292" rx="50" ry="12" fill={FOG}
          variants={fogDrift(0.8, 8, 26)} initial="rest" animate="drift"
        />
      </g>

      {/* ── Speech bubble ── */}
      <motion.g
        variants={bubble}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: '258px 150px', transformBox: 'fill-box' }}
      >
        <rect x="206" y="130" width="104" height="56" rx="12" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        <path d="M232 186 L224 200 L248 186 Z" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        <path d="M234 186 L242 186" stroke={BUBBLE_BG} strokeWidth="3" />

        <text x="258" y="150" textAnchor="middle" fontSize="10" fontFamily="var(--font-display)" fill={INK} fontWeight="600">
          Let&apos;s talk shop
        </text>
        <text x="258" y="164" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          Grab a seat,
        </text>
        <text x="258" y="177" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          coffee&apos;s on me
        </text>
      </motion.g>
    </svg>
  );
}
