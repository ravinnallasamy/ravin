'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

// Door swings open, chef steps out holding a tray with water glass.
// Bubble says "Welcome! Food's getting prepared…"
// Color palette stays on the warm paper/ink/accent theme.

const DOOR_COLOR = '#B08968';       // accent
const DOOR_FRAME = '#96714F';       // accent-hover
const ROOM_BG = '#ECE4D8';          // surface-raised
const CHEF_SKIN = '#F5CBA7';
const CHEF_COAT = '#FAF7F2';        // paper
const CHEF_COAT_SHADOW = '#E2D9CB'; // border
const CHEF_HAT = '#FAF7F2';
const CHEF_HAIR = '#52606D';        // ink-muted
const TRAY_COLOR = '#D2C5AF';       // border-strong
const WATER_GLASS = '#AED6F1';
const WATER = '#5DADE2';
const INK = '#1E2A3A';
const INK_MUTED = '#52606D';
const BUBBLE_BG = '#FAF7F2';
const BUBBLE_BORDER = '#E2D9CB';

export function WelcomeChef() {
  const reduce = useReducedMotion();

  const door = {
    closed: { rotateY: 0 },
    open: { rotateY: reduce ? 0 : -75 },
  };

  const chefSlide = {
    hidden: { x: -80, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const trayFloat: Variants = {
    rest: { y: 0 },
    float: reduce
      ? { y: 0 }
      : { y: [-3, 3, -3], transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' as const } },
  };

  const bubble: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const waterWave: Variants = {
    rest: { d: 'M4 8 Q8 5 12 8 Q16 11 20 8' },
    wave: reduce
      ? { d: 'M4 8 Q8 5 12 8 Q16 11 20 8' }
      : {
          d: ['M4 8 Q8 5 12 8 Q16 11 20 8', 'M4 8 Q8 11 12 8 Q16 5 20 8', 'M4 8 Q8 5 12 8 Q16 11 20 8'],
          transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' as const },
        },
  };

  return (
    <svg
      viewBox="0 0 320 340"
      aria-label="Cartoon chef stepping out of a door with a tray of water, saying welcome"
      className="w-full max-w-sm"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF8F3" />
          <stop offset="100%" stopColor="#EDE6DA" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE7D9" />
          <stop offset="100%" stopColor="#E0D5C1" />
        </linearGradient>
        <linearGradient id="doorFrameGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C5B3D" />
          <stop offset="50%" stopColor="#96714F" />
          <stop offset="100%" stopColor="#7C5B3D" />
        </linearGradient>
        <linearGradient id="doorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C39B78" />
          <stop offset="45%" stopColor="#B08968" />
          <stop offset="100%" stopColor="#8E6A48" />
        </linearGradient>
        <radialGradient id="knobGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F3E9D8" />
          <stop offset="100%" stopColor={TRAY_COLOR} />
        </radialGradient>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1E2A3A" floodOpacity="0.22" />
        </filter>
        <filter id="tinyShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E2A3A" floodOpacity="0.25" />
        </filter>
        <radialGradient id="skinGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FBE0C2" />
          <stop offset="100%" stopColor={CHEF_SKIN} />
        </radialGradient>
        <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EFE7DA" />
        </linearGradient>
        <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EFE7DA" />
        </linearGradient>
        <linearGradient id="trayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6DAC5" />
          <stop offset="100%" stopColor={TRAY_COLOR} />
        </linearGradient>
        <linearGradient id="pantsGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B7A89" />
          <stop offset="100%" stopColor={INK_MUTED} />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCEFFB" stopOpacity="0.85" />
          <stop offset="100%" stopColor={WATER_GLASS} stopOpacity="0.6" />
        </linearGradient>
        <filter id="charShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1E2A3A" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* ── Room floor + wall ── */}
      <rect x="0" y="200" width="320" height="140" fill="url(#floorGrad)" rx="0" />
      <rect x="0" y="0" width="320" height="200" fill="url(#wallGrad)" />
      {/* wall baseboard */}
      <rect x="0" y="196" width="320" height="6" fill={TRAY_COLOR} />
      <rect x="0" y="196" width="320" height="2" fill="white" opacity="0.4" />

      {/* ── Door frame ── */}
      <rect x="60" y="40" width="130" height="175" rx="4" fill="url(#doorFrameGrad)" filter="url(#softShadow)" />
      {/* door reveal (the room inside) */}
      <rect x="66" y="46" width="118" height="163" rx="2" fill={ROOM_BG} />

      {/* ── Animated door panel (perspective swing) ── */}
      <motion.g
        style={{ transformOrigin: '66px 120px', transformBox: 'fill-box' }}
        variants={door}
        initial="closed"
        animate="open"
        transition={{ delay: 0.3, duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* door face */}
        <rect x="66" y="46" width="118" height="163" rx="2" fill="url(#doorGrad)" filter="url(#tinyShadow)" />
        {/* door panels — inset bevel look */}
        <rect x="74" y="56" width="48" height="66" rx="3" fill={DOOR_FRAME} opacity="0.35" />
        <rect x="74" y="56" width="48" height="3" rx="1.5" fill="#1E2A3A" opacity="0.15" />
        <rect x="130" y="56" width="46" height="66" rx="3" fill={DOOR_FRAME} opacity="0.35" />
        <rect x="130" y="56" width="46" height="3" rx="1.5" fill="#1E2A3A" opacity="0.15" />
        <rect x="74" y="132" width="102" height="66" rx="3" fill={DOOR_FRAME} opacity="0.35" />
        <rect x="74" y="132" width="102" height="3" rx="1.5" fill="#1E2A3A" opacity="0.15" />
        {/* vertical sheen highlight */}
        <rect x="72" y="50" width="10" height="155" rx="5" fill="white" opacity="0.18" />
        {/* door knob */}
        <circle cx="170" cy="132" r="6.5" fill="url(#knobGrad)" filter="url(#tinyShadow)" />
        <circle cx="168" cy="130" r="2" fill="white" opacity="0.7" />
        <circle cx="170" cy="132" r="3.5" fill={DOOR_FRAME} />
      </motion.g>

      {/* ── Chef character ── */}
      <motion.g
        variants={chefSlide}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.1, duration: 0.7, ease: [0.34, 1.1, 0.64, 1] }}
      >
        {/* shadow */}
        <ellipse cx="188" cy="218" rx="34" ry="7" fill={INK} opacity="0.18" />

        {/* legs */}
        <rect x="172" y="186" width="14" height="36" rx="6" fill="url(#pantsGrad)" />
        <rect x="190" y="186" width="14" height="36" rx="6" fill="url(#pantsGrad)" />
        {/* shoes */}
        <ellipse cx="179" cy="222" rx="10" ry="5" fill={INK} filter="url(#tinyShadow)" />
        <ellipse cx="197" cy="222" rx="10" ry="5" fill={INK} filter="url(#tinyShadow)" />
        <ellipse cx="177" cy="220" rx="3" ry="1.4" fill="white" opacity="0.3" />
        <ellipse cx="195" cy="220" rx="3" ry="1.4" fill="white" opacity="0.3" />

        {/* chef coat body */}
        <rect x="163" y="130" width="50" height="62" rx="12" fill="url(#coatGrad)" filter="url(#charShadow)" />
        <rect x="163" y="130" width="50" height="62" rx="12" fill="none" stroke={CHEF_COAT_SHADOW} strokeWidth="1.5" />
        {/* coat center line */}
        <line x1="188" y1="134" x2="188" y2="190" stroke={CHEF_COAT_SHADOW} strokeWidth="1.5" />
        {/* buttons — small embossed circles */}
        <circle cx="188" cy="146" r="2.5" fill={CHEF_COAT_SHADOW} />
        <circle cx="187.3" cy="145.3" r="0.8" fill="white" opacity="0.6" />
        <circle cx="188" cy="158" r="2.5" fill={CHEF_COAT_SHADOW} />
        <circle cx="187.3" cy="157.3" r="0.8" fill="white" opacity="0.6" />
        <circle cx="188" cy="170" r="2.5" fill={CHEF_COAT_SHADOW} />
        <circle cx="187.3" cy="169.3" r="0.8" fill="white" opacity="0.6" />

        {/* left arm (outstretched holding tray) */}
        <motion.g
          variants={trayFloat}
          initial="rest"
          animate="float"
          style={{ willChange: 'transform' }}
        >
          {/* arm */}
          <path
            d="M163 148 Q138 148 128 150"
            fill="none"
            stroke={CHEF_COAT}
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M163 148 Q138 148 128 150"
            fill="none"
            stroke={CHEF_COAT_SHADOW}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* hand */}
          <circle cx="126" cy="150" r="8" fill="url(#skinGrad)" />

          {/* tray */}
          <ellipse cx="112" cy="146" rx="25" ry="5" fill={INK} opacity="0.18" />
          <ellipse cx="112" cy="144" rx="26" ry="5" fill="url(#trayGrad)" />
          <rect x="86" y="140" width="52" height="5" rx="2" fill="url(#trayGrad)" />
          <ellipse cx="112" cy="142.5" rx="22" ry="1.4" fill="white" opacity="0.4" />

          {/* water glass on tray */}
          <rect x="100" y="122" width="18" height="20" rx="3" fill="url(#glassGrad)" />
          <rect x="100" y="122" width="18" height="20" rx="3" fill="none" stroke={CHEF_COAT_SHADOW} strokeWidth="1" />
          {/* water surface animated */}
          <motion.path
            variants={waterWave}
            initial="rest"
            animate="wave"
            fill="none"
            stroke={WATER}
            strokeWidth="1.5"
            strokeLinecap="round"
            transform="translate(99 124)"
          />
          {/* water fill */}
          <rect x="101" y="128" width="16" height="12" rx="0" fill={WATER} opacity="0.35" />
          {/* glass highlight */}
          <rect x="102" y="124" width="3" height="14" rx="1.5" fill="white" opacity="0.35" />
        </motion.g>

        {/* right arm (relaxed, slightly out) */}
        <path
          d="M213 148 Q228 158 230 168"
          fill="none"
          stroke={CHEF_COAT}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M213 148 Q228 158 230 168"
          fill="none"
          stroke={CHEF_COAT_SHADOW}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="231" cy="170" r="8" fill="url(#skinGrad)" />

        {/* neck */}
        <rect x="181" y="118" width="14" height="16" rx="4" fill="url(#skinGrad)" />

        {/* head */}
        <ellipse cx="188" cy="108" rx="26" ry="26" fill="url(#skinGrad)" filter="url(#charShadow)" />

        {/* hair / ears */}
        <ellipse cx="162" cy="110" rx="5" ry="6" fill="url(#skinGrad)" />
        <ellipse cx="214" cy="110" rx="5" ry="6" fill="url(#skinGrad)" />
        <path d="M163 92 Q188 78 213 92" fill={CHEF_HAIR} />

        {/* eyes */}
        <ellipse cx="179" cy="108" rx="4" ry="4.5" fill="white" />
        <ellipse cx="197" cy="108" rx="4" ry="4.5" fill="white" />
        <circle cx="180" cy="109" r="2.5" fill={INK} />
        <circle cx="198" cy="109" r="2.5" fill={INK} />
        {/* eye shine */}
        <circle cx="181" cy="108" r="1" fill="white" />
        <circle cx="199" cy="108" r="1" fill="white" />

        {/* eyebrows — friendly raised */}
        <path d="M175 101 Q179 98 183 101" stroke={CHEF_HAIR} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M193 101 Q197 98 201 101" stroke={CHEF_HAIR} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* smile */}
        <path d="M179 118 Q188 126 197 118" stroke={DOOR_FRAME} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* chef hat */}
        <rect x="170" y="68" width="36" height="10" rx="3" fill="url(#hatGrad)" stroke={CHEF_COAT_SHADOW} strokeWidth="1" filter="url(#tinyShadow)" />
        <rect x="175" y="44" width="26" height="28" rx="8" fill="url(#hatGrad)" stroke={CHEF_COAT_SHADOW} strokeWidth="1" />
        {/* hat puff top */}
        <ellipse cx="188" cy="45" rx="13" ry="9" fill="url(#hatGrad)" stroke={CHEF_COAT_SHADOW} strokeWidth="1" />
        <ellipse cx="183" cy="41" rx="5" ry="2.5" fill="white" opacity="0.5" />
      </motion.g>

      {/* ── Speech bubble ── */}
      <motion.g
        variants={bubble}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.7, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: '240px 80px', transformBox: 'fill-box' }}
      >
        <rect x="222" y="30" width="90" height="62" rx="12" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" filter="url(#softShadow)" />
        {/* tail pointing toward chef */}
        <path d="M242 92 L232 106 L255 92 Z" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        <path d="M244 92 L250 92" stroke={BUBBLE_BG} strokeWidth="3" />

        <text x="267" y="52" textAnchor="middle" fontSize="10" fontFamily="var(--font-display)" fill={INK} fontWeight="600">
          Welcome!
        </text>
        <text x="267" y="66" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          Here&apos;s some water
        </text>
        <text x="267" y="79" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          while you explore!
        </text>

        {/* animated ellipsis dots at bottom right of bubble — "food's cooking" hint */}
        {!reduce && (
          <>
            <motion.circle
              cx="280" cy="86" r="2" fill={DOOR_COLOR}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
            />
            <motion.circle
              cx="288" cy="86" r="2" fill={DOOR_COLOR}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
            />
            <motion.circle
              cx="296" cy="86" r="2" fill={DOOR_COLOR}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}
            />
          </>
        )}
      </motion.g>

      {/* ── Steam from "kitchen" (behind door) ── */}
      {!reduce && (
        <motion.g opacity="0" animate={{ opacity: [0, 0.6, 0] }} transition={{ delay: 0.5, duration: 2, repeat: Infinity, repeatDelay: 1.5 }}>
          <motion.path
            d="M95 80 Q98 68 95 56"
            fill="none" stroke={TRAY_COLOR} strokeWidth="3" strokeLinecap="round"
            animate={{ y: [0, -8] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 0.5 }}
          />
          <motion.path
            d="M108 75 Q112 63 109 51"
            fill="none" stroke={TRAY_COLOR} strokeWidth="3" strokeLinecap="round"
            animate={{ y: [0, -8] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 0.8 }}
          />
          <motion.path
            d="M121 78 Q125 66 122 54"
            fill="none" stroke={TRAY_COLOR} strokeWidth="3" strokeLinecap="round"
            animate={{ y: [0, -8] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 1.1 }}
          />
        </motion.g>
      )}
    </svg>
  );
}
