'use client';

// Centered square scene: a terrible commit message card center stage, launching a rocket straight up
export function RocketCommit() {
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
          .rocket-hull { animation: launch-trajectory 5s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: 0px 0px; }
          .thruster-glow { animation: thruster-pulse 0.15s ease-in-out infinite alternate; }
          .exhaust-smoke-1 { animation: puff-fade 1.6s ease-out infinite; }
          .exhaust-smoke-2 { animation: puff-fade 1.6s ease-out infinite 0.53s; }
          .exhaust-smoke-3 { animation: puff-fade 1.6s ease-out infinite 1.06s; }
          .commit-text-glow { animation: card-pulse 4s ease-in-out infinite alternate; }
          .star-shimmer { animation: star-glow-pulse 3s ease-in-out infinite; }
        }

        @keyframes launch-trajectory {
          0% { transform: translate(0, 0); opacity: 1; }
          75% { transform: translate(0, -260px); opacity: 1; }
          90% { transform: translate(0, -330px); opacity: 0; }
          91% { transform: translate(0, 40px); opacity: 0; }
          100% { transform: translate(0, 0); opacity: 1; }
        }
        @keyframes thruster-pulse {
          0% { transform: scaleY(0.9) scaleX(0.95); opacity: 0.85; }
          100% { transform: scaleY(1.3) scaleX(1.05); opacity: 1; }
        }
        @keyframes puff-fade {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0.5; }
          100% { transform: translate(8px, 55px) scale(1.8); opacity: 0; }
        }
        @keyframes card-pulse {
          0% { opacity: 0.55; filter: drop-shadow(0 2px 6px rgba(176,137,104,0.12)); }
          100% { opacity: 0.9; filter: drop-shadow(0 6px 16px rgba(176,137,104,0.28)); }
        }
        @keyframes star-glow-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.75; }
        }
      `}</style>

      <defs>
        <filter id="rocket-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="rocket-flame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B08968" stopOpacity="1" />
          <stop offset="40%" stopColor="#96714F" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#B08968" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="exhaust-trail-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D2C5AF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rocket-body-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ECE4D8" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Shimmering stars around the frame */}
      <circle className="star-shimmer" cx="90" cy="110" r="2" fill="#B08968" />
      <circle className="star-shimmer" cx="510" cy="100" r="2" fill="#B08968" style={{ animationDelay: '1s' }} />
      <circle className="star-shimmer" cx="470" cy="470" r="2.5" fill="#D2C5AF" style={{ animationDelay: '2s' }} />
      <circle className="star-shimmer" cx="110" cy="480" r="2" fill="#B08968" style={{ animationDelay: '0.5s' }} />

      {/* ── Rocket, launching straight up from the card, dead center ──
          Outer <g> only positions (static transform attribute); inner <g> carries the CSS animation.
          A CSS `animation` that sets `transform` overrides an element's own transform="" attribute entirely,
          so mixing both on one node causes the base translate to be dropped mid-animation. */}
      <g transform="translate(300, 300) scale(0.9)">
        <g className="rocket-hull">
          <rect x="-3" y="60" width="6" height="150" rx="3" fill="url(#exhaust-trail-grad)" />

          <g transform="translate(0, 60)">
            <circle className="exhaust-smoke-1" cx="-12" cy="15" r="10" fill="#D2C5AF" />
            <circle className="exhaust-smoke-2" cx="12" cy="20" r="8" fill="#D2C5AF" />
            <circle className="exhaust-smoke-3" cx="0" cy="30" r="12" fill="#D2C5AF" />
          </g>

          <ellipse className="thruster-glow" cx="0" cy="50" rx="16" ry="32" fill="url(#rocket-flame-grad)" />
          <ellipse className="thruster-glow" cx="-18" cy="48" rx="8" ry="18" fill="url(#rocket-flame-grad)" style={{ animationDelay: '0.07s' }} />
          <ellipse className="thruster-glow" cx="18" cy="48" rx="8" ry="18" fill="url(#rocket-flame-grad)" style={{ animationDelay: '0.07s' }} />

          <path d="M-28,30 L-50,65 L-28,55 Z" fill="#D2C5AF" stroke="#D2C5AF" strokeWidth="1.5" />
          <path d="M28,30 L50,65 L28,55 Z" fill="#D2C5AF" stroke="#D2C5AF" strokeWidth="1.5" />

          <path d="M-28,-70 L-28,40 C-28,45 -20,50 0,50 C20,50 28,45 28,40 L28,-70 C28,-100 20,-120 0,-150 C-20,-120 -28,-100 -28,-70 Z"
                fill="url(#rocket-body-grad)" stroke="#D2C5AF" strokeWidth="2" strokeLinejoin="round" filter="url(#rocket-glow)" />

          <line x1="-26" y1="-30" x2="26" y2="-30" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.6" />
          <line x1="-26" y1="5" x2="26" y2="5" stroke="#D2C5AF" strokeWidth="1.5" opacity="0.6" />

          <circle cx="0" cy="-50" r="16" fill="#1E2A3A" opacity="0.15" />
          <circle cx="0" cy="-50" r="11" fill="none" stroke="#D2C5AF" strokeWidth="1.5" />
        </g>
      </g>

      {/* ── Terrible commit message, launch pad, dead center — plain floating text, no card ── */}
      <g className="commit-text-glow" transform="translate(300, 440)">
        <text x="0" y="-6" textAnchor="middle" fontSize="15" fontFamily="var(--font-mono), monospace" fill="#B08968" letterSpacing="0.5">
          $ git commit -m
        </text>
        <text x="0" y="20" textAnchor="middle" fontSize="15" fontFamily="var(--font-mono), monospace" fill="#1E2A3A" fontStyle="italic" opacity="0.75">
          &quot;fix idk it works now&quot;
        </text>

        {/* Blinking cursor */}
        <rect x="140" y="8" width="8" height="16" fill="#B08968" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0;0.7" dur="1s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Caption under the pad */}
      <g transform="translate(300, 528)">
        <text textAnchor="middle" fontSize="13" fontFamily="var(--font-mono), monospace" fill="#B08968" opacity="0.6" letterSpacing="3">
          LAUNCHED ANYWAY
        </text>
      </g>
    </svg>
  );
}
