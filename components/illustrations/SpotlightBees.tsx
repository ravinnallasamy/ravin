'use client';

// Centered square stage audition: a bug center-stage in a spotlight, performing like the lead
export function SpotlightBees() {
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-full w-full"
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .spot-cone-left { animation: beam-swing-left 6s ease-in-out infinite alternate; transform-origin: 0px 0px; }
          .spot-cone-right { animation: beam-swing-right 7s ease-in-out infinite alternate; transform-origin: 0px 0px; }
          .ambient-pulse { animation: pulse-glow 4s ease-in-out infinite alternate; }
          .star-twinkle { animation: twinkle 3s ease-in-out infinite; }
          .bug-bow { animation: bug-take-a-bow 4s ease-in-out infinite; transform-origin: 300px 420px; }
          .bug-leg-left { animation: leg-tap-l 0.6s ease-in-out infinite alternate; transform-origin: 270px 400px; }
          .bug-leg-right { animation: leg-tap-r 0.6s ease-in-out infinite alternate; transform-origin: 330px 400px; }
          .wing-flutter-left { animation: flutter 0.09s linear infinite alternate; transform-origin: 285px 350px; }
          .wing-flutter-right { animation: flutter 0.09s linear infinite alternate-reverse; transform-origin: 315px 350px; }
          .confetti-1 { animation: drift-fall 4s linear infinite; }
          .confetti-2 { animation: drift-fall 4.5s linear infinite 1.2s; }
          .confetti-3 { animation: drift-fall 3.8s linear infinite 2.4s; }
        }

        @keyframes beam-swing-left { 0% { transform: rotate(-5deg); opacity: 0.14; } 100% { transform: rotate(2deg); opacity: 0.2; } }
        @keyframes beam-swing-right { 0% { transform: rotate(5deg); opacity: 0.2; } 100% { transform: rotate(-2deg); opacity: 0.14; } }
        @keyframes pulse-glow { 0% { opacity: 0.25; } 100% { opacity: 0.55; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 0.9; transform: scale(1.2); } }
        @keyframes bug-take-a-bow {
          0%, 20% { transform: translateY(0) rotate(0deg); }
          35% { transform: translateY(6px) rotate(6deg); }
          50% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes leg-tap-l { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }
        @keyframes leg-tap-r { from { transform: rotate(10deg); } to { transform: rotate(-10deg); } }
        @keyframes flutter { from { transform: scaleY(1); } to { transform: scaleY(0.15); } }
        @keyframes drift-fall {
          0% { transform: translateY(-20px) rotate(0deg) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translateY(160px) rotate(360deg) scale(1.1); opacity: 0; }
        }
      `}</style>

      <defs>
        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="beam-grad-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B08968" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#B08968" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#B08968" stopOpacity="0.00" />
        </linearGradient>
        <linearGradient id="beam-grad-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ECE4D8" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#B08968" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#B08968" stopOpacity="0.00" />
        </linearGradient>
        <radialGradient id="center-stage" cx="50%" cy="72%" r="42%">
          <stop offset="0%" stopColor="#F0E6D8" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#FAF7F2" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bug-shell-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B08968" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#96714F" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Ambient stage glow, centered on the bug */}
      <circle className="ambient-pulse" cx="300" cy="420" r="180" fill="url(#center-stage)" filter="url(#strong-glow)" />

      {/* Two spotlights crossing toward center.
          Outer <g> only positions (static transform attribute); inner <g> carries the CSS animation.
          A CSS `animation` that sets `transform` overrides an element's own transform="" attribute entirely,
          so mixing both on one node causes the base translate to be dropped mid-animation. */}
      <g transform="translate(150, 40)">
        <g className="spot-cone-left">
          <polygon points="0,0 -110,420 130,420" fill="url(#beam-grad-left)" />
        </g>
      </g>
      <g transform="translate(450, 40)">
        <g className="spot-cone-right">
          <polygon points="0,0 -130,420 110,420" fill="url(#beam-grad-right)" />
        </g>
      </g>

      {/* Stage floor, centered */}
      <ellipse cx="300" cy="470" rx="200" ry="18" fill="#D2C5AF" opacity="0.15" />
      <line x1="90" y1="470" x2="510" y2="470" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.3" strokeDasharray="6 4" />

      {/* Twinkling ambient stars around the frame */}
      <g className="star-twinkle" style={{ transformOrigin: '110px 90px' }}>
        <circle cx="110" cy="90" r="2.5" fill="#B08968" filter="url(#soft-glow)" />
      </g>
      <g className="star-twinkle" style={{ transformOrigin: '490px 110px', animationDelay: '1.5s' }}>
        <circle cx="490" cy="110" r="2" fill="#B08968" filter="url(#soft-glow)" />
      </g>
      <g className="star-twinkle" style={{ transformOrigin: '150px 200px', animationDelay: '0.8s' }}>
        <circle cx="150" cy="200" r="1.5" fill="#ECE4D8" opacity="0.8" />
      </g>
      <g className="star-twinkle" style={{ transformOrigin: '450px 190px', animationDelay: '2.2s' }}>
        <circle cx="450" cy="190" r="2" fill="#B08968" opacity="0.5" />
      </g>

      {/* Celebration confetti drifting around the star of the show */}
      <g className="confetti-1">
        <polygon points="200,140 205,148 210,140 205,132" fill="#B08968" opacity="0.6" />
      </g>
      <g className="confetti-2">
        <polygon points="400,120 404,127 408,120 404,113" fill="#D2C5AF" opacity="0.8" />
      </g>
      <g className="confetti-3">
        <polygon points="230,110 234,117 238,110 234,103" fill="#ECE4D8" opacity="0.5" />
      </g>

      {/* ── The Bug, center stage, taking its bow ── */}
      <g className="bug-bow">
        {/* Legs */}
        <g className="bug-leg-left">
          <path d="M270,400 Q245,400 250,430" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M270,415 Q245,415 250,445" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>
        <g className="bug-leg-right">
          <path d="M330,400 Q355,400 350,430" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M330,415 Q355,415 350,445" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* Body, dead center of the frame */}
        <ellipse cx="300" cy="400" rx="38" ry="50" fill="url(#bug-shell-grad)" stroke="#D2C5AF" strokeWidth="2.5" filter="url(#soft-glow)" />

        {/* Segment lines */}
        <path d="M266,388 Q300,394 334,388" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.5" />
        <path d="M265,412 Q300,418 335,412" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.5" />

        {/* Wings spread like a performer's cape */}
        <ellipse className="wing-flutter-left" cx="285" cy="350" rx="18" ry="42" fill="#FAF7F2" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.5" transform="rotate(-16, 285, 350)" />
        <ellipse className="wing-flutter-right" cx="315" cy="350" rx="18" ry="42" fill="#FAF7F2" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.5" transform="rotate(16, 315, 350)" />

        {/* Head */}
        <circle cx="300" cy="330" r="22" fill="#ECE4D8" stroke="#D2C5AF" strokeWidth="2.5" />

        {/* Eyes, bright with the spotlight */}
        <circle cx="291" cy="326" r="4.5" fill="#1E2A3A" />
        <circle cx="309" cy="326" r="4.5" fill="#1E2A3A" />
        <circle cx="289" cy="324" r="1.6" fill="#FAF7F2" />
        <circle cx="307" cy="324" r="1.6" fill="#FAF7F2" />

        {/* Antennae reaching up like jazz hands */}
        <path d="M288,312 Q278,296 272,276" stroke="#1E2A3A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M312,312 Q322,296 328,276" stroke="#1E2A3A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="272" cy="276" r="4.5" fill="#B08968" filter="url(#soft-glow)" />
        <circle cx="328" cy="276" r="4.5" fill="#B08968" filter="url(#soft-glow)" />
      </g>

      {/* Marquee-style label under the stage */}
      <g transform="translate(300, 540)">
        <text textAnchor="middle" fontSize="13" fontFamily="var(--font-mono), monospace" fill="#B08968" opacity="0.6" letterSpacing="3">
          NOW AUDITIONING
        </text>
      </g>
    </svg>
  );
}
