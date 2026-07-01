'use client';

// Full-section: giant sleepy mug left, dozing moon right, stars everywhere
export function SleepyMug() {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-full w-full"
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .steam-1 { animation: steam-rise 2.8s ease-in-out infinite; }
          .steam-2 { animation: steam-rise 2.8s ease-in-out infinite 0.9s; }
          .steam-3 { animation: steam-rise 2.8s ease-in-out infinite 1.8s; }
          .moon-bob { animation: moon-float 4s ease-in-out infinite; }
          .z-1 { animation: z-drift 2.8s ease-out infinite; }
          .z-2 { animation: z-drift 2.8s ease-out infinite 0.93s; }
          .z-3 { animation: z-drift 2.8s ease-out infinite 1.86s; }
          .star-tw-1 { animation: tw 2s ease-in-out infinite 0s; }
          .star-tw-2 { animation: tw 2s ease-in-out infinite 0.7s; }
          .star-tw-3 { animation: tw 2s ease-in-out infinite 1.4s; }
          .star-tw-4 { animation: tw 2s ease-in-out infinite 0.35s; }
          .wave { animation: liquid-sway 2.4s ease-in-out infinite; transform-origin: 340px 460px; }
        }
        @keyframes steam-rise {
          0%   { transform:translateY(0) scaleX(1);     opacity:0; }
          15%  { opacity:0.65; }
          70%  { transform:translateY(-120px) scaleX(1.4); opacity:0.4; }
          100% { transform:translateY(-180px) scaleX(0.6); opacity:0; }
        }
        @keyframes moon-float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-18px); }
        }
        @keyframes z-drift {
          0%   { transform:translate(0,0)     scale(0.5); opacity:0; }
          25%  { opacity:1; }
          100% { transform:translate(60px,-110px) scale(1.4); opacity:0; }
        }
        @keyframes tw {
          0%,100% { opacity:0.15; } 50% { opacity:0.9; }
        }
        @keyframes liquid-sway {
          0%,100% { transform:skewX(0deg); } 50% { transform:skewX(2deg); }
        }
      `}</style>

      <defs>
        <clipPath id="sm-safe"><rect width="1200" height="700" /></clipPath>
      </defs>
      <g clipPath="url(#sm-safe)">

      {/* Stars */}
      <circle className="star-tw-1" cx="100"  cy="80"  r="4" fill="#B08968" />
      <circle className="star-tw-2" cx="500"  cy="40"  r="3" fill="#B08968" />
      <circle className="star-tw-3" cx="900"  cy="100" r="4" fill="#B08968" />
      <circle className="star-tw-4" cx="1100" cy="60"  r="3" fill="#B08968" />
      <circle cx="200"  cy="200" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="700"  cy="150" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="1050" cy="300" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="60"   cy="400" r="2" fill="#B08968" opacity="0.2" />
      <circle cx="1150" cy="500" r="2" fill="#B08968" opacity="0.2" />
      <circle cx="30"   cy="120" r="2" fill="#B08968" opacity="0.2" />
      <circle cx="350"  cy="600" r="2" fill="#B08968" opacity="0.2" />
      <circle cx="1180" cy="220" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="20"   cy="640" r="2" fill="#B08968" opacity="0.18" />
      <circle cx="600"  cy="650" r="2" fill="#B08968" opacity="0.2" />
      <circle cx="950"  cy="600" r="3" fill="#B08968" opacity="0.25" />

      {/* ── Giant mug (centre-left) ── */}
      <g transform="translate(340,300)">
        {/* Mug body */}
        <rect x="-130" y="-80" width="260" height="200" rx="18" fill="#ECE4D8" stroke="#D2C5AF" strokeWidth="3" />
        {/* Base */}
        <rect x="-150" y="116" width="300" height="20" rx="8" fill="#D2C5AF" />
        {/* Handle */}
        <path d="M130,-40 Q210,-40 210,60 Q210,160 130,160" stroke="#D2C5AF" strokeWidth="16" fill="none" strokeLinecap="round" />
        {/* Coffee liquid */}
        <g className="wave">
          <rect x="-126" y="-20" width="252" height="156" rx="10" fill="#B08968" opacity="0.28" />
          <ellipse cx="0" cy="-20" rx="126" ry="14" fill="#96714F" opacity="0.45" />
        </g>
        {/* Steam */}
        <g transform="translate(-60,-80)">
          <path className="steam-1" d="M0,0 Q-14,-30 0,-58 Q14,-86 0,-116" stroke="#94A0AB" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(0,-90)">
          <path className="steam-2" d="M0,0 Q16,-30 0,-58 Q-16,-86 0,-116" stroke="#94A0AB" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(60,-80)">
          <path className="steam-3" d="M0,0 Q-10,-30 0,-58 Q10,-86 0,-116" stroke="#94A0AB" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* ── Moon (right side) ── */}
      <g className="moon-bob" transform="translate(870,280)">
        <path d="M0,-110 A110,110 0 1 1 -77.8,77.8 A70,70 0 0 0 0,-110 Z" fill="#ECE4D8" stroke="#D2C5AF" strokeWidth="3" />
        {/* Sleepy eyes */}
        <path d="M-38,-16 Q-26,-30 -14,-16" stroke="#1E2A3A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M14,-16 Q26,-30 38,-16"  stroke="#1E2A3A" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Smile */}
        <path d="M-20,24 Q0,40 20,24" stroke="#94A0AB" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="-46" cy="14" rx="16" ry="10" fill="#B08968" opacity="0.2" />
        <ellipse cx="46"  cy="14" rx="16" ry="10" fill="#B08968" opacity="0.2" />
        {/* ZZZ */}
        <text className="z-1" x="90"  y="0"   fontSize="38" fontWeight="bold" fill="#B08968" fontFamily="monospace">z</text>
        <text className="z-2" x="115" y="-50" fontSize="50" fontWeight="bold" fill="#B08968" fontFamily="monospace">z</text>
        <text className="z-3" x="148" y="-110" fontSize="64" fontWeight="bold" fill="#B08968" fontFamily="monospace">Z</text>
      </g>

      {/* Small decorative stars near moon */}
      <circle cx="700" cy="180" r="3" fill="#B08968" opacity="0.4" />
      <circle cx="760" cy="120" r="2" fill="#B08968" opacity="0.3" />
      <circle cx="1050" cy="160" r="3" fill="#B08968" opacity="0.35" />

      </g>
    </svg>
  );
}
