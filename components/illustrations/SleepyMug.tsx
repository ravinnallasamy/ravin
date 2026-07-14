'use client';

// Centered square night scene: crescent moon above, sleepy coffee mug below, both on the vertical centerline
export function SleepyMug() {
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
          .steam-line-1 { animation: steam-flow 3.5s ease-in-out infinite; }
          .steam-line-2 { animation: steam-flow 3.5s ease-in-out infinite 1.1s; }
          .moon-float { animation: floating-moon 6s ease-in-out infinite; }
          .zzz-text-1 { animation: drift-z 3s ease-out infinite; }
          .zzz-text-2 { animation: drift-z 3s ease-out infinite 1s; }
          .zzz-text-3 { animation: drift-z 3s ease-out infinite 2s; }
          .star-glow-1 { animation: star-pulsate 2.5s ease-in-out infinite; }
          .star-glow-2 { animation: star-pulsate 2.5s ease-in-out infinite 0.8s; }
          .star-glow-3 { animation: star-pulsate 2.5s ease-in-out infinite 1.6s; }
          .cup-glowing { animation: border-glow-pulse 4s ease-in-out infinite alternate; }
        }

        @keyframes steam-flow {
          0% { opacity: 0; transform: translateY(10px) scaleX(0.9); }
          15% { opacity: 0.85; }
          75% { opacity: 0.55; }
          100% { opacity: 0; transform: translateY(-70px) scaleX(1.3); }
        }
        @keyframes floating-moon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes drift-z {
          0% { transform: translate(0, 0) scale(0.6) rotate(-5deg); opacity: 0; }
          20% { opacity: 0.95; }
          80% { opacity: 0.6; }
          100% { transform: translate(30px, -60px) scale(1.1) rotate(15deg); opacity: 0; }
        }
        @keyframes star-pulsate {
          0%, 100% { opacity: 0.45; transform: scale(0.8); }
          50% { opacity: 0.95; transform: scale(1.25); }
        }
        @keyframes border-glow-pulse {
          0% { opacity: 0.65; filter: drop-shadow(0 2px 4px rgba(176,137,104,0.25)); }
          100% { opacity: 0.95; filter: drop-shadow(0 4px 12px rgba(176,137,104,0.55)); }
        }
      `}</style>

      <defs>
        <filter id="moon-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="cup-fill-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ECE4D8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ECE4D8" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="moon-fill-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ECE4D8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B08968" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Twinkling stars scattered around the pair, kept away from the vertical centerline */}
      <g className="star-glow-1" style={{ transformOrigin: '110px 90px' }}>
        <path d="M110,82 L112,88 L118,90 L112,92 L110,98 L108,92 L102,90 L108,88 Z" fill="#B08968" />
      </g>
      <g className="star-glow-2" style={{ transformOrigin: '490px 130px', animationDelay: '0.6s' }}>
        <path d="M490,125 L491.5,129 L495,130 L491.5,131 L490,135 L488.5,131 L485,130 L488.5,129 Z" fill="#B08968" opacity="0.8" />
      </g>
      <g className="star-glow-3" style={{ transformOrigin: '470px 400px', animationDelay: '1.2s' }}>
        <path d="M470,392 L472,398 L478,400 L472,402 L470,408 L468,402 L462,400 L468,398 Z" fill="#B08968" />
      </g>
      <circle cx="130" cy="230" r="1.5" fill="#B08968" opacity="0.5" />
      <circle cx="90" cy="380" r="1.5" fill="#B08968" opacity="0.45" />
      <circle cx="510" cy="260" r="1.5" fill="#B08968" opacity="0.4" />

      {/* ── Moon, upper half, centered horizontally — full disc with a crescent shadow cut by an offset circle ── */}
      {/* Outer <g> only positions (static transform attribute); inner <g> carries the CSS animation.
          A CSS `animation` that sets `transform` overrides an element's own transform="" attribute entirely,
          so mixing both on one node causes the base translate to be dropped mid-animation. */}
      <g transform="translate(300, 140)">
        <g className="moon-float">
          <circle cx="0" cy="0" r="80" fill="url(#moon-fill-grad)" opacity="0.65" filter="url(#moon-glow)" />

          <mask id="moon-crescent-mask">
            <rect x="-90" y="-90" width="180" height="180" fill="white" />
            <circle cx="24" cy="-16" r="58" fill="black" />
          </mask>
          <circle cx="0" cy="0" r="68" fill="url(#moon-fill-grad)" stroke="#B08968" strokeWidth="2.5" mask="url(#moon-crescent-mask)" />

          {/* Sleeping face */}
          <path d="M-38,-8 Q-30,-15 -22,-8" stroke="#1E2A3A" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M-30,14 Q-21,21 -12,14" stroke="#1E2A3A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
          <circle cx="-40" cy="6" r="6.5" fill="#B08968" opacity="0.35" />
        </g>
      </g>

      {/* ── Mug, lower half, centered horizontally, steam rising toward the moon ── */}
      <g className="cup-glowing" transform="translate(300, 430)">
        <path d="M75,-28 C108,-28 116,28 75,35" stroke="#B08968" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        <path d="M-75,-55 L-75,60 C-75,74 -60,76 -45,76 L45,76 C60,76 75,74 75,60 L75,-55 Z"
              stroke="#B08968" strokeWidth="2.5" fill="url(#cup-fill-grad)" strokeLinecap="round" strokeLinejoin="round" />

        <line x1="-70" y1="-16" x2="70" y2="-16" stroke="#96714F" strokeWidth="1.5" opacity="0.7" strokeDasharray="5 3" />

        {/* Steam rising, becoming Z's toward the moon */}
        <g transform="translate(0, -70)">
          <path className="steam-line-1" d="M0,15 Q-10,0 0,-15 Q10,-30 0,-45"
                stroke="#96714F" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
        <g transform="translate(-22, -62)">
          <path className="steam-line-2" d="M0,15 Q8,0 0,-15 Q-8,-30 0,-45"
                stroke="#B08968" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75" />
        </g>

        {/* Zzz drifting up out of the steam toward the moon */}
        <g transform="translate(30, -85)">
          <text className="zzz-text-1" x="0" y="0" fontSize="16" fill="#96714F" opacity="0" fontFamily="'Georgia', serif" fontStyle="italic" fontWeight="300">z</text>
          <text className="zzz-text-2" x="12" y="-20" fontSize="22" fill="#96714F" opacity="0" fontFamily="'Georgia', serif" fontStyle="italic" fontWeight="300">z</text>
          <text className="zzz-text-3" x="28" y="-46" fontSize="30" fill="#96714F" opacity="0" fontFamily="'Georgia', serif" fontStyle="italic" fontWeight="300">Z</text>
        </g>
      </g>
    </svg>
  );
}
