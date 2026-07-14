'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

// A highly realistic single-page daily newspaper broadsheet illustration.
// Features a bold "BLOGS BY RAVIN" masthead, double horizontal rules, and date lines.
// Instead of a page-turning animation, this version animates the text writing from left to right,
// line-by-line, on a loop, simulating typewriter/printing action.
// No coffee cup or page flips. The speech bubble sits entirely above the paper to prevent overlapping text.

const INK = '#1E2A3A';
const INK_MUTED = '#52606D';
const PAPER_BG = '#FAF7F2';
const PAPER_SHADOW = '#E2D9CB';
const PAPER_BORDER = '#D2C5AF';
const ACCENT = '#96714F';
const ACCENT_LIGHT = '#B08968';
const BUBBLE_BG = '#FAF7F2';
const BUBBLE_BORDER = '#E2D9CB';

export function NewspaperReader() {
  const reduce = useReducedMotion();

  // Staggered writing timeline parameters:
  // Master Loop Duration: 12 seconds
  // 0.0s - 0.2s: Delay / Start
  // 0.2s - 1.2s: Headline 1 reveals (0.2 -> 1.2s)
  // 1.5s - 2.5s: Paragraph 1, Line 1 reveals
  // 2.5s - 3.5s: Paragraph 1, Line 2 reveals
  // 3.5s - 4.5s: Paragraph 1, Line 3 reveals
  // 4.8s - 5.6s: Headline 2 reveals
  // 5.8s - 6.8s: Paragraph 2, Line 1 reveals
  // 6.8s - 7.8s: Paragraph 2, Line 2 reveals
  // 7.8s - 8.8s: Paragraph 2, Line 3 reveals
  // 9.0s - 9.8s: Flowchart Diagram reveals
  // 9.8s - 11.2s: Stays complete for reading
  // 11.2s - 11.7s: Fades out
  // 11.7s - 12.0s: Resets to blank

  const loopDuration = 12;

  // Master opacity for the writing content (fades out at the end of the loop)
  const contentFade: Variants = {
    rest: { opacity: 1 },
    animate: reduce
      ? { opacity: 1 }
      : {
          opacity: [1, 1, 0, 0, 1],
          transition: {
            duration: loopDuration,
            times: [0, 0.92, 0.96, 0.99, 1.0],
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
  };

  const bubblePop: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1.0,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  // Helper to generate Framer Motion keyframe widths for standard width clip paths
  const getClipWidthTransition = (startMs: number, endMs: number) => {
    if (reduce) return { width: 195 };

    const startPct = startMs / (loopDuration * 1000);
    const endPct = endMs / (loopDuration * 1000);
    const fadeStartPct = 11000 / (loopDuration * 1000); // 11s
    const fadeEndPct = 11600 / (loopDuration * 1000);  // 11.6s

    return {
      width: [0, 0, 195, 195, 0, 0],
      transition: {
        duration: loopDuration,
        times: [0, startPct, endPct, fadeStartPct, fadeEndPct, 1.0],
        repeat: Infinity,
        ease: 'linear' as const,
      },
    };
  };

  return (
    <svg
      viewBox="0 0 320 340"
      aria-label="Illustration of a newspaper on a table with text writing itself dynamically from left to right"
      className="w-full max-w-sm"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="tableShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={PAPER_BORDER} stopOpacity="0.45" />
          <stop offset="75%" stopColor={PAPER_BORDER} stopOpacity="0.15" />
          <stop offset="100%" stopColor={PAPER_BORDER} stopOpacity="0" />
        </radialGradient>

        {/* ── Typing Clip Paths ── */}
        <clipPath id="clipHeadline">
          <motion.rect x="62" y="128" height="17" animate={getClipWidthTransition(200, 1200)} />
        </clipPath>
        
        <clipPath id="clipP1L1">
          <motion.rect x="62" y="148" height="9" animate={getClipWidthTransition(1500, 2500)} />
        </clipPath>
        <clipPath id="clipP1L2">
          <motion.rect x="62" y="155" height="9" animate={getClipWidthTransition(2500, 3500)} />
        </clipPath>
        <clipPath id="clipP1L3">
          <motion.rect x="62" y="162" height="9" animate={getClipWidthTransition(3500, 4500)} />
        </clipPath>

        <clipPath id="clipHeadline2">
          <motion.rect x="62" y="176" height="11" animate={getClipWidthTransition(4800, 5600)} />
        </clipPath>

        <clipPath id="clipP2L1">
          <motion.rect x="62" y="188" height="9" animate={getClipWidthTransition(5800, 6800)} />
        </clipPath>
        <clipPath id="clipP2L2">
          <motion.rect x="62" y="195" height="9" animate={getClipWidthTransition(6800, 7800)} />
        </clipPath>
        <clipPath id="clipP2L3">
          <motion.rect x="62" y="202" height="9" animate={getClipWidthTransition(7800, 8800)} />
        </clipPath>

        <clipPath id="clipDiagram">
          <motion.rect x="62" y="215" height="85" animate={getClipWidthTransition(9000, 9800)} />
        </clipPath>
      </defs>

      {/* ── Table Shadow ── */}
      <ellipse cx="160" cy="315" rx="135" ry="12" fill="url(#tableShadow)" />

      {/* ── Broadsheet Back Pages (Stacked thickness effect) ── */}
      <g>
        {/* Layer 1 (bottom-most) */}
        <rect x="49" y="86" width="222" height="220" rx="3" fill={PAPER_SHADOW} stroke={PAPER_BORDER} strokeWidth="0.8" />
        {/* Layer 2 */}
        <rect x="52" y="83" width="216" height="220" rx="3" fill={PAPER_SHADOW} stroke={PAPER_BORDER} strokeWidth="0.8" />
      </g>

      {/* ── Main Broadsheet Front Page (Static Container) ── */}
      <g>
        {/* Newspaper front-page body (shifted down to leave room at the top) */}
        <rect x="55" y="80" width="210" height="220" rx="3" fill={PAPER_BG} stroke={PAPER_SHADOW} strokeWidth="1.5" />
        
        {/* Masthead Header - Static */}
        <text x="160" y="102" fontFamily="Georgia, serif" fontWeight="bold" fontSize="15px" fill={INK} textAnchor="middle" letterSpacing="0.5">
          BLOGS BY RAVIN
        </text>
        <text x="160" y="110" fontFamily="Georgia, serif" fontSize="4.2px" fill={INK_MUTED} textAnchor="middle" letterSpacing="0.2">
          THE DAILY CHRONICLE OF ARTIFICIAL INTELLIGENCE &amp; FULL-STACK CODE
        </text>
        
        {/* Editorial double lines */}
        <line x1="62" y1="114" x2="258" y2="114" stroke={INK} strokeWidth="0.8" />
        <line x1="62" y1="116.5" x2="258" y2="116.5" stroke={INK} strokeWidth="0.25" />

        {/* Date / Edition Line */}
        <text x="160" y="122.5" fontFamily="Georgia, serif" fontSize="4px" fill={INK_MUTED} textAnchor="middle" letterSpacing="0.5">
          VOL. 1 · NO. 5 · FREE EDITION · COIMBATORE, INDIA
        </text>
        
        <line x1="62" y1="126" x2="258" y2="126" stroke={PAPER_SHADOW} strokeWidth="0.75" />
      </g>

      {/* ── Animated Writing Content Container ── */}
      <motion.g variants={contentFade} initial="rest" animate="animate">
        
        {/* ── Headline 1 ── */}
        <g clipPath="url(#clipHeadline)">
          <text x="62" y="141" fontFamily="Georgia, serif" fontWeight="bold" fontSize="8.2px" fill={INK} letterSpacing="0.1">
            AI AGENTS SHIP REAL CODE
          </text>
        </g>

        {/* ── Paragraph 1 ── */}
        <g fontFamily="Georgia, serif" fontSize="5.2px" fill={INK_MUTED}>
          <g clipPath="url(#clipP1L1)">
            <text x="62" y="153">Agent loops are shifting from simple auto-complete</text>
          </g>
          <g clipPath="url(#clipP1L2)">
            <text x="62" y="160">into fully autonomous systems. Agents write tests,</text>
          </g>
          <g clipPath="url(#clipP1L3)">
            <text x="62" y="167">execute compilers, and self-correct syntax errors.</text>
          </g>
        </g>

        {/* ── Headline 2 ── */}
        <g clipPath="url(#clipHeadline2)">
          <text x="62" y="182" fontFamily="Georgia, serif" fontWeight="bold" fontSize="6.8px" fill={INK} letterSpacing="0.1">
            REVOLUTIONIZING THE WEB FLOW
          </text>
        </g>

        {/* ── Paragraph 2 ── */}
        <g fontFamily="Georgia, serif" fontSize="5.2px" fill={INK_MUTED}>
          <g clipPath="url(#clipP2L1)">
            <text x="62" y="193">By leveraging database indexing and vector search,</text>
          </g>
          <g clipPath="url(#clipP2L2)">
            <text x="62" y="200">applications achieve real-time query understanding,</text>
          </g>
          <g clipPath="url(#clipP2L3)">
            <text x="62" y="207">delivering contextual answers and clean dashboards.</text>
          </g>
        </g>

        {/* ── Diagram: AI Agent Compiler Loop ── */}
        <g clipPath="url(#clipDiagram)">
          {/* Flowchart background box */}
          <rect x="62" y="218" width="196" height="74" rx="4" fill="none" stroke={PAPER_BORDER} strokeWidth="1" strokeDasharray="3 3" />
          
          <text x="160" y="227" fontFamily="Georgia, serif" fontWeight="bold" fontSize="5px" fill={ACCENT} textAnchor="middle">
            AI AGENT DEPLOYMENT LOOP
          </text>

          {/* Left Bubble: Agent */}
          <rect x="70" y="237" width="46" height="20" rx="3" fill="#FAF7F2" stroke={ACCENT_LIGHT} strokeWidth="1" />
          <text x="93" y="249" fontFamily="Georgia, serif" fontWeight="bold" fontSize="5px" fill={INK} textAnchor="middle">
            Agent
          </text>

          {/* Right Bubble: Compiler */}
          <rect x="204" y="237" width="46" height="20" rx="3" fill="#FAF7F2" stroke={ACCENT_LIGHT} strokeWidth="1" />
          <text x="227" y="249" fontFamily="Georgia, serif" fontWeight="bold" fontSize="5px" fill={INK} textAnchor="middle">
            Compiler
          </text>

          {/* Connective arrow 1: Agent -> Compiler */}
          <path d="M 116 243 H 204" stroke={INK} strokeWidth="0.75" />
          <path d="M 199 240.5 L 204 243 L 199 245.5" fill={INK} />
          <text x="160" y="240.5" fontFamily="Georgia, serif" fontSize="3.8px" fill={INK_MUTED} textAnchor="middle">
            Executes Code
          </text>

          {/* Connective arrow 2: Compiler -> Agent */}
          <path d="M 204 252 H 116" stroke={INK} strokeWidth="0.75" />
          <path d="M 121 249.5 L 116 252 L 121 254.5" fill={INK} />
          <text x="160" y="258" fontFamily="Georgia, serif" fontSize="3.8px" fill={INK_MUTED} textAnchor="middle">
            Returns Logs &amp; Build Status
          </text>

          {/* Status Label */}
          <text x="160" y="281" fontFamily="Georgia, serif" fontWeight="bold" fontSize="4.8px" fill={ACCENT} textAnchor="middle">
            STATUS: SOLVING PROBLEMS...
          </text>
        </g>

      </motion.g>

      {/* ── Hands holding Newspaper at bottom corners (Foreground layer) ── */}
      <g>
        {/* Left hand */}
        <circle cx="51" cy="265" r="7.5" fill="#F5CBA7" stroke={PAPER_BORDER} strokeWidth="1" />
        <path d="M 47 265 C 47 261, 55 261, 55 265" stroke={PAPER_BORDER} strokeWidth="1" fill="none" />
        {/* Right hand */}
        <circle cx="269" cy="265" r="7.5" fill="#F5CBA7" stroke={PAPER_BORDER} strokeWidth="1" />
        <path d="M 265 265 C 265 261, 273 261, 273 265" stroke={PAPER_BORDER} strokeWidth="1" fill="none" />
      </g>

      {/* ── Speech Bubble (Placed above the paper to avoid overlap) ── */}
      <motion.g
        variants={bubblePop}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: '240px 75px', transformBox: 'fill-box' }}
      >
        {/* bubble base */}
        <rect x="200" y="12" width="106" height="58" rx="12" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        {/* tail pointing down towards newspaper */}
        <path d="M 225 70 L 213 86 L 237 70 Z" fill={BUBBLE_BG} stroke={BUBBLE_BORDER} strokeWidth="1.5" />
        <path d="M 227 70 L 235 70" stroke={BUBBLE_BG} strokeWidth="3" />

        <text x="253" y="32" textAnchor="middle" fontSize="10.5" fontFamily="var(--font-display)" fill={INK} fontWeight="600">
          Blogs by Ravin
        </text>
        <text x="253" y="46" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          AI &amp; Full-stack logs,
        </text>
        <text x="253" y="58" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-body)" fill={INK_MUTED}>
          printed in real-time!
        </text>
      </motion.g>
    </svg>
  );
}