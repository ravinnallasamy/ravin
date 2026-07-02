'use client';

// Centered square promotion ceremony: a graduating bug receiving its "FEATURE" diploma, dead center
export function GradBugs() {
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
          .bug-hop { animation: proud-hop 3s ease-in-out infinite; transform-origin: 300px 400px; }
          .scroll-diploma { animation: diploma-hover 5s ease-in-out infinite alternate; transform-origin: 0px 0px; }
          .glitter-particle-1 { animation: drift-fall 4s linear infinite; }
          .glitter-particle-2 { animation: drift-fall 4.5s linear infinite 1.2s; }
          .glitter-particle-3 { animation: drift-fall 3.8s linear infinite 2.4s; }
          .bug-leg-left { animation: leg-swing-l 0.5s ease-in-out infinite alternate; transform-origin: 270px 390px; }
          .bug-leg-right { animation: leg-swing-r 0.5s ease-in-out infinite alternate; transform-origin: 330px 390px; }
          .cap-tassel-swing { animation: tassel-sway 0.5s ease-in-out infinite alternate; transform-origin: 322px 298px; }
        }

        @keyframes proud-hop {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes diploma-hover {
          0% { transform: translateY(0) rotate(-4deg); }
          100% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes drift-fall {
          0% { transform: translateY(-20px) rotate(0deg) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translateY(120px) rotate(360deg) scale(1.1); opacity: 0; }
        }
        @keyframes leg-swing-l { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
        @keyframes leg-swing-r { from { transform: rotate(15deg); } to { transform: rotate(-15deg); } }
        @keyframes tassel-sway { from { transform: rotate(-12deg); } to { transform: rotate(12deg); } }
      `}</style>

      <defs>
        <filter id="diploma-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="diploma-sheet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ECE4D8" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="bug-shell-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B08968" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Groundline, centered under the ceremony */}
      <line x1="80" y1="470" x2="520" y2="470" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.3" strokeDasharray="6 4" />

      {/* Celebration glitter around the pair */}
      <g className="glitter-particle-1">
        <polygon points="150,150 155,158 160,150 155,142" fill="#B08968" opacity="0.6" />
      </g>
      <g className="glitter-particle-2">
        <polygon points="440,140 444,147 448,140 444,133" fill="#D2C5AF" opacity="0.8" />
      </g>
      <g className="glitter-particle-3">
        <polygon points="470,220 475,228 480,220 475,212" fill="#B08968" opacity="0.6" />
      </g>
      <g className="glitter-particle-1" style={{ animationDelay: '2.1s' }}>
        <polygon points="130,240 134,247 138,240 134,233" fill="#ECE4D8" opacity="0.5" />
      </g>
      <g className="glitter-particle-2" style={{ animationDelay: '0.8s' }}>
        <polygon points="200,120 205,128 210,120 205,112" fill="#B08968" opacity="0.5" />
      </g>

      {/* ── The graduating bug, left of center, taking its promotion diploma ── */}
      <g className="bug-hop" transform="translate(-70, 0)">
        <g className="bug-leg-left">
          <path d="M270,375 Q245,375 250,405" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
          <path d="M270,395 Q245,395 250,425" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
        </g>
        <g className="bug-leg-right">
          <path d="M330,375 Q355,375 350,405" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
          <path d="M330,395 Q355,395 350,425" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
        </g>

        <ellipse cx="300" cy="400" rx="36" ry="48" fill="url(#bug-shell-grad)" stroke="#D2C5AF" strokeWidth="2.5" />

        <path d="M267,388 Q300,393 333,388" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.5" />
        <path d="M266,412 Q300,417 334,412" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.5" />

        <ellipse cx="281" cy="397" rx="17" ry="41" fill="#FAF7F2" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.45" transform="rotate(-10, 281, 397)" />
        <ellipse cx="319" cy="397" rx="17" ry="41" fill="#FAF7F2" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.45" transform="rotate(10, 319, 397)" />

        <circle cx="300" cy="345" r="19" fill="#ECE4D8" stroke="#D2C5AF" strokeWidth="2.5" />

        <circle cx="294" cy="341" r="4" fill="#1E2A3A" />
        <circle cx="306" cy="341" r="4" fill="#1E2A3A" />
        <circle cx="295" cy="339" r="1.3" fill="#FAF7F2" />
        <circle cx="307" cy="339" r="1.3" fill="#FAF7F2" />

        <path d="M292,327 Q285,313 282,296" stroke="#1E2A3A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M308,327 Q315,313 318,296" stroke="#1E2A3A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="282" cy="296" r="4" fill="#1E2A3A" />
        <circle cx="318" cy="296" r="4" fill="#1E2A3A" />

        {/* Graduation cap */}
        <polygon points="300,278 268,296 300,314 332,296" fill="#1E2A3A" stroke="#1E2A3A" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M290,304 C290,312 310,312 310,304" stroke="#1E2A3A" strokeWidth="4" strokeLinecap="round" />

        <g className="cap-tassel-swing">
          <path d="M322,296 Q332,309 330,324" stroke="#B08968" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="330" cy="326" r="4.5" fill="#B08968" />
        </g>

        {/* Front leg reaching toward the diploma */}
        <path d="M330,410 Q352,395 368,382" stroke="#1E2A3A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      </g>

      {/* ── Diploma scroll being handed over, right of center — curled edges, no card border ──
          Outer <g> only positions (static transform attribute); inner <g> carries the CSS animation.
          A CSS `animation` that sets `transform` overrides an element's own transform="" attribute entirely,
          so mixing both on one node causes the base translate to be dropped mid-animation. */}
      <g transform="translate(440, 340) scale(0.8)">
        <g className="scroll-diploma">
          <ellipse cx="0" cy="0" rx="100" ry="75" fill="#B08968" opacity="0.05" filter="url(#diploma-glow)" />

          {/* Scroll body with rolled top and bottom edges */}
          <path
            d="M-90,-56 C-90,-64 90,-64 90,-56 L90,56 C90,64 -90,64 -90,56 Z"
            fill="url(#diploma-sheet)"
          />
          <ellipse cx="0" cy="-56" rx="90" ry="8" fill="url(#diploma-sheet)" stroke="#D2C5AF" strokeWidth="1.5" />
          <ellipse cx="0" cy="56" rx="90" ry="8" fill="url(#diploma-sheet)" stroke="#D2C5AF" strokeWidth="1.5" />

          <text x="-8" y="-28" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono), monospace" fill="#B08968" letterSpacing="1.5" opacity="0.85">
            CERTIFIED
          </text>
          <text x="-8" y="-4" textAnchor="middle" fontSize="15" fontFamily="var(--font-mono), monospace" fill="#1E2A3A" fontWeight="600" letterSpacing="1">
            FEATURE
          </text>
          <line x1="-42" y1="12" x2="26" y2="12" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.6" />

          <circle cx="52" cy="26" r="14" fill="none" stroke="#B08968" strokeWidth="1.5" />
          <circle cx="52" cy="26" r="10" fill="#ECE4D8" stroke="#B08968" strokeWidth="1" />
          <text x="52" y="30" textAnchor="middle" fontSize="11" fill="#B08968" fontFamily="sans-serif">✓</text>
        </g>
      </g>
    </svg>
  );
}
