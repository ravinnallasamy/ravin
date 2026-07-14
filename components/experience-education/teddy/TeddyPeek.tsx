'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { openResumeChat } from '@/lib/resumeChat';

// A teddy bear hides behind the hero's stat card — only its head and the
// top half of its paws poke up above the card's top edge, as if gripping
// it from behind. Mount as the first child of a `relative` card; it
// anchors itself so the SVG's own bottom edge (y = VIEWBOX_HEIGHT) sits
// exactly on the card's top border — the art is drawn already "cut off"
// at that line, so no cross-element overflow-clipping math is needed.
// The "Want to hire?" ad bubble above its head never dismisses — always shown.

const FUR = '#C89B6B';
const FUR_DARK = '#B08355';
const FUR_LIGHT = '#E4C299';
const MUZZLE = '#F3E0BE';
const INK = '#1E2A3A';
const NOSE = '#5C4433';

const VIEWBOX_WIDTH = 160;
const VIEWBOX_HEIGHT = 100; // this line = the card's top border
const RENDER_WIDTH = 112;
const RENDER_HEIGHT = (VIEWBOX_HEIGHT / VIEWBOX_WIDTH) * RENDER_WIDTH;

const blink: Variants = {
  open: { scaleY: 1 },
  closed: { scaleY: 0.08 },
};

// Head glances left, pauses, glances right, pauses, then returns to center —
// a slow, readable loop rather than a fast twitch.
const headLook: Variants = {
  center: { x: 0 },
  look: {
    x: [0, -7, -7, 0, 7, 7, 0],
    transition: {
      repeat: Infinity,
      duration: 6,
      times: [0, 0.12, 0.35, 0.47, 0.59, 0.82, 1],
      ease: 'easeInOut',
    },
  },
};

// Eyes lead the head slightly (glance a beat before the head turns), same
// timing shape so they read as tracking the same look.
const eyesLook: Variants = {
  center: { x: 0 },
  look: {
    x: [0, -2.5, -2.5, 0, 2.5, 2.5, 0],
    transition: {
      repeat: Infinity,
      duration: 6,
      times: [0, 0.12, 0.35, 0.47, 0.59, 0.82, 1],
      ease: 'easeInOut',
    },
  },
};

const bubbleFloat: Variants = {
  rest: { y: 0 },
  float: { y: [0, -6, 0], transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } },
};

const peekRise: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function TeddyPeek({ name = 'me' }: { name?: string }) {
  const reduce = !!useReducedMotion();

  const wiggleLeft: Variants = {
    rest: { rotate: 0 },
    wiggle: reduce ? { rotate: 0 } : { rotate: [0, -5, 0], transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' } },
  };
  const wiggleRight: Variants = {
    rest: { rotate: 0 },
    wiggle: reduce ? { rotate: 0 } : { rotate: [0, 5, 0], transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut', delay: 0.2 } },
  };

  return (
    <motion.div
      variants={peekRise}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] }}
      className="pointer-events-none absolute bottom-full right-24 z-30 flex flex-col items-center sm:right-32"
    >
      {/* ── Ad bubble — always visible, gently bobbing, never dismisses.
          Clicking it opens the resume AI chat directly. ── */}
      <motion.button
        type="button"
        onClick={openResumeChat}
        aria-label={`Try ${name}'s AI resume chat`}
        variants={bubbleFloat}
        initial="rest"
        animate="float"
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        className="pointer-events-auto relative z-10 mb-4 flex cursor-pointer items-center gap-4 rounded-full border border-white/50 bg-paper/95 px-10 py-4 shadow-glass backdrop-blur-glass transition-colors hover:border-accent/50 hover:bg-accent-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wide text-ink">
          Hire {name}? Try {name} AI →
        </span>
      </motion.button>
      <div className="-mt-2 mb-2 h-5 w-5 rotate-45 border-b border-r border-white/50 bg-paper/95" />

      {/* ── Teddy — art is drawn only down to y=VIEWBOX_HEIGHT, i.e. the card's
          top border; the paws are circles centered a little above that line
          so only their top half is ever drawn, reading as "gripping" the edge. ── */}
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        width={RENDER_WIDTH}
        height={RENDER_HEIGHT}
        aria-hidden
        style={{ display: 'block', overflow: 'hidden' }}
      >
        <defs>
          <radialGradient id="teddyHeadGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={FUR_LIGHT} />
            <stop offset="100%" stopColor={FUR} />
          </radialGradient>
          <radialGradient id="teddyPawGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={FUR_LIGHT} />
            <stop offset="100%" stopColor={FUR_DARK} />
          </radialGradient>
          <filter id="teddyShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={INK} floodOpacity="0.2" />
          </filter>
        </defs>

        {/* head — glances left/right on a slow loop, everything moves together */}
        <motion.g
          variants={headLook}
          initial="center"
          animate={reduce ? 'center' : 'look'}
        >
          {/* ears */}
          <circle cx="48" cy="18" r="14" fill="url(#teddyHeadGrad)" filter="url(#teddyShadow)" />
          <circle cx="112" cy="18" r="14" fill="url(#teddyHeadGrad)" filter="url(#teddyShadow)" />
          <circle cx="48" cy="18" r="7" fill={MUZZLE} opacity="0.8" />
          <circle cx="112" cy="18" r="7" fill={MUZZLE} opacity="0.8" />

          {/* head */}
          <circle cx="80" cy="42" r="42" fill="url(#teddyHeadGrad)" filter="url(#teddyShadow)" />

          {/* muzzle */}
          <ellipse cx="80" cy="56" rx="20" ry="15" fill={MUZZLE} />

          {/* eyes — glance in the same direction as the head, plus a blink loop */}
          <motion.g
            variants={eyesLook}
            initial="center"
            animate={reduce ? 'center' : 'look'}
          >
            <motion.g
              variants={blink}
              animate={reduce ? 'open' : ['open', 'open', 'closed', 'open']}
              transition={reduce ? undefined : { repeat: Infinity, duration: 4, times: [0, 0.85, 0.92, 1], ease: 'easeInOut' }}
              style={{ transformOrigin: '80px 39px', transformBox: 'fill-box' }}
            >
              <circle cx="66" cy="39" r="5" fill={INK} />
              <circle cx="94" cy="39" r="5" fill={INK} />
              <circle cx="67.5" cy="37.5" r="1.4" fill="white" />
              <circle cx="95.5" cy="37.5" r="1.4" fill="white" />
            </motion.g>
          </motion.g>

          {/* eyebrows — soft, innocent */}
          <path d="M59 30 Q66 26 73 30" stroke={FUR_DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M87 30 Q94 26 101 30" stroke={FUR_DARK} strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* nose */}
          <ellipse cx="80" cy="50" rx="5" ry="3.5" fill={NOSE} />

          {/* mouth */}
          <path d="M80 54 L80 60 Q80 64 76 65" stroke={NOSE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M80 60 Q84 64 88 62" stroke={NOSE} strokeWidth="1.6" fill="none" strokeLinecap="round" />

          {/* cheeks — blush */}
          <ellipse cx="54" cy="54" rx="6" ry="4" fill="#E8A67B" opacity="0.45" />
          <ellipse cx="106" cy="54" rx="6" ry="4" fill="#E8A67B" opacity="0.45" />
        </motion.g>

        {/* paws — centered right at the viewBox bottom (the card edge), so only
            their top half is ever visible, as if hooked over the border */}
        <motion.g variants={wiggleLeft} initial="rest" animate="wiggle" style={{ transformOrigin: `38px ${VIEWBOX_HEIGHT}px`, transformBox: 'fill-box' }}>
          <circle cx="38" cy={VIEWBOX_HEIGHT} r="15" fill="url(#teddyPawGrad)" filter="url(#teddyShadow)" />
          <circle cx="32" cy={VIEWBOX_HEIGHT - 4} r="4" fill={FUR_LIGHT} opacity="0.7" />
          <circle cx="42" cy={VIEWBOX_HEIGHT - 6} r="4" fill={FUR_LIGHT} opacity="0.7" />
        </motion.g>
        <motion.g variants={wiggleRight} initial="rest" animate="wiggle" style={{ transformOrigin: `122px ${VIEWBOX_HEIGHT}px`, transformBox: 'fill-box' }}>
          <circle cx="122" cy={VIEWBOX_HEIGHT} r="15" fill="url(#teddyPawGrad)" filter="url(#teddyShadow)" />
          <circle cx="116" cy={VIEWBOX_HEIGHT - 4} r="4" fill={FUR_LIGHT} opacity="0.7" />
          <circle cx="126" cy={VIEWBOX_HEIGHT - 6} r="4" fill={FUR_LIGHT} opacity="0.7" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
