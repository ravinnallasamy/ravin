'use client';

// Full-section: 6 grad-cap bugs marching left→right across the full width toward a giant diploma
export function GradBugs() {
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
          .bug-1 { animation: march 2.4s ease-in-out infinite 0s; }
          .bug-2 { animation: march 2.4s ease-in-out infinite 0.4s; }
          .bug-3 { animation: march 2.4s ease-in-out infinite 0.8s; }
          .bug-4 { animation: march 2.4s ease-in-out infinite 1.2s; }
          .bug-5 { animation: march 2.4s ease-in-out infinite 1.6s; }
          .bug-6 { animation: march 2.4s ease-in-out infinite 2.0s; }
          .diploma-wave { animation: dip-wave 2.4s ease-in-out infinite; transform-origin: 980px 340px; }
          .confetti-a { animation: fall 2.8s linear infinite 0s; }
          .confetti-b { animation: fall 2.8s linear infinite 0.7s; }
          .confetti-c { animation: fall 2.8s linear infinite 1.4s; }
          .confetti-d { animation: fall 2.8s linear infinite 2.1s; }
          .confetti-e { animation: fall 2.8s linear infinite 0.35s; }
          .confetti-f { animation: fall 2.8s linear infinite 1.75s; }
          .confetti-g { animation: fall 2.8s linear infinite 1.05s; }
          .confetti-h { animation: fall 2.8s linear infinite 2.45s; }
          .confetti-i { animation: fall 2.8s linear infinite 0.55s; }
          .confetti-j { animation: fall 2.8s linear infinite 1.9s; }
          .leg-l { animation: leg-l 0.48s ease-in-out infinite alternate; }
          .leg-r { animation: leg-r 0.48s ease-in-out infinite alternate; }
          .tassel { animation: tassel-sw 0.48s ease-in-out infinite alternate; }
        }
        @keyframes march {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-14px); }
        }
        @keyframes dip-wave {
          0%,100% { transform:rotate(-5deg); } 50% { transform:rotate(5deg); }
        }
        @keyframes fall {
          0%   { transform:translate(0,-20px) rotate(0deg);   opacity:1; }
          100% { transform:translate(0,80px) rotate(540deg); opacity:0; }
        }
        @keyframes leg-l {
          from { transform:rotate(-22deg); } to { transform:rotate(22deg); }
        }
        @keyframes leg-r {
          from { transform:rotate(22deg); } to { transform:rotate(-22deg); }
        }
        @keyframes tassel-sw {
          from { transform:rotate(-18deg); } to { transform:rotate(18deg); }
        }
      `}</style>

      <defs>
        <clipPath id="gb-safe"><rect width="1200" height="700" /></clipPath>
      </defs>
      <g clipPath="url(#gb-safe)">

      {/* Ground */}
      <line x1="0" y1="560" x2="1200" y2="560" stroke="#E2D9CB" strokeWidth="2" opacity="0.5" />

      {/* Confetti */}
      <rect className="confetti-a" x="200"  y="200" width="14" height="14" rx="2" fill="#B08968" opacity="0.7"  transform="rotate(20,207,207)" />
      <rect className="confetti-b" x="400"  y="160" width="12" height="12" rx="2" fill="#52606D" opacity="0.55" transform="rotate(45,406,166)" />
      <rect className="confetti-c" x="620"  y="220" width="14" height="14" rx="2" fill="#B08968" opacity="0.65" transform="rotate(60,627,227)" />
      <rect className="confetti-d" x="820"  y="170" width="10" height="18" rx="2" fill="#94A0AB" opacity="0.55" transform="rotate(30,825,179)" />
      <rect className="confetti-e" x="300"  y="140" width="12" height="12" rx="2" fill="#D2C5AF" opacity="0.6"  transform="rotate(15,306,146)" />
      <rect className="confetti-f" x="700"  y="190" width="14" height="8"  rx="2" fill="#B08968" opacity="0.5"  transform="rotate(50,707,194)" />
      <rect className="confetti-g" x="60"   y="120" width="12" height="12" rx="2" fill="#94A0AB" opacity="0.5"  transform="rotate(25,66,126)" />
      <rect className="confetti-h" x="1050" y="250" width="14" height="14" rx="2" fill="#B08968" opacity="0.55" transform="rotate(40,1057,257)" />
      <rect className="confetti-i" x="500"  y="80"  width="10" height="10" rx="2" fill="#D2C5AF" opacity="0.5"  transform="rotate(10,505,85)" />
      <rect className="confetti-j" x="1130" y="100" width="12" height="12" rx="2" fill="#52606D" opacity="0.45" transform="rotate(55,1136,106)" />

      {/* ── Giant diploma (right side, destination) ── */}
      <g className="diploma-wave" transform="translate(980,340)">
        <rect x="-90" y="-70" width="180" height="140" rx="10" fill="#FAF7F2" stroke="#D2C5AF" strokeWidth="3" />
        <line x1="-60" y1="-30" x2="60"  y2="-30" stroke="#D2C5AF" strokeWidth="3" />
        <line x1="-60" y1="-6"  x2="60"  y2="-6"  stroke="#D2C5AF" strokeWidth="3" />
        <line x1="-60" y1="18"  x2="30"  y2="18"  stroke="#D2C5AF" strokeWidth="3" />
        {/* Ribbon */}
        <rect x="-90" y="-14" width="22" height="28" rx="3" fill="#B08968" />
        <rect x="68"  y="-14" width="22" height="28" rx="3" fill="#B08968" />
        <line x1="-80" y1="0" x2="80" y2="0" stroke="#B08968" strokeWidth="2" opacity="0.35" />
        {/* Gold star */}
        <text x="-20" y="-44" fontSize="36" fill="#B08968">★</text>
        {/* Seal */}
        <circle cx="55" cy="48" r="18" fill="#ECE4D8" stroke="#B08968" strokeWidth="2" />
        <text x="46" y="53" fontSize="14" fill="#B08968" fontFamily="monospace">✓</text>
      </g>

      {/* 6 bugs marching evenly spaced */}
      <Bug cx={120}  cy={520} cls="bug-1" />
      <Bug cx={300}  cy={520} cls="bug-2" />
      <Bug cx={480}  cy={520} cls="bug-3" />
      <Bug cx={660}  cy={520} cls="bug-4" />
      <Bug cx={840}  cy={520} cls="bug-5" />
      <Bug cx={820}  cy={380} cls="bug-6" />

      </g>
    </svg>
  );
}

function Bug({ cx, cy, cls }: { cx: number; cy: number; cls: string }) {
  return (
    <g transform={`translate(${cx},${cy})`} className={cls}>
      {/* Legs */}
      <g className="leg-l" style={{ transformOrigin: '-40px 0px' }}>
        <line x1="-40" y1="0"   x2="-62" y2="26"  stroke="#1E2A3A" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
        <line x1="-40" y1="-14" x2="-62" y2="12"  stroke="#1E2A3A" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
        <line x1="-40" y1="14"  x2="-62" y2="40"  stroke="#1E2A3A" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
      </g>
      <g className="leg-r" style={{ transformOrigin: '40px 0px' }}>
        <line x1="40"  y1="0"   x2="62"  y2="26"  stroke="#1E2A3A" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
        <line x1="40"  y1="-14" x2="62"  y2="12"  stroke="#1E2A3A" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
        <line x1="40"  y1="14"  x2="62"  y2="40"  stroke="#1E2A3A" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
      </g>
      {/* Abdomen */}
      <ellipse cy="-48" rx="32" ry="24" fill="#96714F" />
      {/* Body (thorax) */}
      <ellipse cy="8" rx="40" ry="28" fill="#B08968" />
      {/* Wing sheaths */}
      <ellipse cx="-24" cy="2" rx="20" ry="28" fill="#ECE4D8" opacity="0.65" transform="rotate(-12)" />
      <ellipse cx="24"  cy="2" rx="20" ry="28" fill="#ECE4D8" opacity="0.65" transform="rotate(12)" />
      {/* Head */}
      <circle cy="-82" r="28" fill="#B08968" />
      {/* Eyes */}
      <circle cx="-10" cy="-86" r="6" fill="#1E2A3A" />
      <circle cx="10"  cy="-86" r="6" fill="#1E2A3A" />
      <circle cx="-8"  cy="-88" r="2" fill="#FAF7F2" opacity="0.7" />
      <circle cx="12"  cy="-88" r="2" fill="#FAF7F2" opacity="0.7" />
      {/* Antennae */}
      <line x1="-10" y1="-108" x2="-26" y2="-136" stroke="#1E2A3A" strokeWidth="3" strokeLinecap="round" />
      <line x1="10"  y1="-108" x2="26"  y2="-136" stroke="#1E2A3A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-26" cy="-136" r="5" fill="#1E2A3A" />
      <circle cx="26"  cy="-136" r="5" fill="#1E2A3A" />
      {/* Grad cap board */}
      <rect x="-46" y="-152" width="92" height="14" rx="3" fill="#1E2A3A" />
      <rect x="-16" y="-180" width="32" height="30" rx="3" fill="#1E2A3A" />
      {/* Tassel */}
      <g className="tassel" style={{ transformOrigin: '40px -152px' }}>
        <line x1="40" y1="-152" x2="58" y2="-118" stroke="#B08968" strokeWidth="4" strokeLinecap="round" />
        <circle cx="58" cy="-114" r="7" fill="#B08968" />
      </g>
    </g>
  );
}
