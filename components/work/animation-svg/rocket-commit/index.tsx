'use client';

// Full-section: rocket launching from a git tree (left), commit ticker at bottom
export function RocketCommit() {
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
          .rocket  { animation: rocket-launch 4s cubic-bezier(0.4,0,0.2,1) infinite; }
          .flame-m { animation: flame-flicker 0.18s ease-in-out infinite alternate; transform-origin: 600px 520px; }
          .flame-sl{ animation: flame-side    0.22s ease-in-out infinite alternate; transform-origin: 578px 518px; }
          .flame-sr{ animation: flame-side    0.22s ease-in-out infinite alternate-reverse; transform-origin: 622px 518px; }
          .smoke-a { animation: smoke-puff 1.4s ease-out infinite 0s; }
          .smoke-b { animation: smoke-puff 1.4s ease-out infinite 0.47s; }
          .smoke-c { animation: smoke-puff 1.4s ease-out infinite 0.94s; }
          .ticker  { animation: ticker-scroll 9s linear infinite; }
          .node-p  { animation: node-pulse 2s ease-in-out infinite; }
          .exhaust-trail { animation: trail-fade 4s cubic-bezier(0.4,0,0.2,1) infinite; }
          .win-blink { animation: win-blink 4s step-end infinite; }
        }
        @keyframes rocket-launch {
          0%   { transform:translate(0,0);     opacity:1; }
          72%  { transform:translate(-80px,-440px); opacity:1; }
          88%  { transform:translate(-100px,-520px); opacity:0; }
          89%  { transform:translate(0,0);     opacity:0; }
          100% { transform:translate(0,0);     opacity:1; }
        }
        @keyframes flame-flicker {
          from { transform:scaleY(1)   scaleX(1); }
          to   { transform:scaleY(1.4) scaleX(0.8); }
        }
        @keyframes flame-side {
          from { transform:scaleY(1)   rotate(0deg); }
          to   { transform:scaleY(0.6) rotate(10deg); }
        }
        @keyframes smoke-puff {
          0%   { transform:translate(0,0)    scale(0.4); opacity:0.6; }
          100% { transform:translate(0,80px) scale(2);   opacity:0; }
        }
        @keyframes ticker-scroll {
          from { transform:translateX(320px); }
          to   { transform:translateX(-1100px); }
        }
        @keyframes node-pulse {
          0%,100% { r:8; opacity:0.6; } 50% { r:11; opacity:1; }
        }
        @keyframes trail-fade {
          0%,100% { opacity:0; }
          10%,70% { opacity:0.35; }
          88%     { opacity:0; }
        }
        @keyframes win-blink {
          0%,100% { opacity:1; } 40% { opacity:0; } 42% { opacity:1; }
        }
      `}</style>

      <defs>
        <clipPath id="rc-safe"><rect width="1200" height="700" /></clipPath>
        <clipPath id="rc-clip"><rect x="0" y="638" width="1200" height="40" /></clipPath>
      </defs>
      <g clipPath="url(#rc-safe)">

      {/* ── Git branch tree (left column) ── */}
      <g transform="translate(200,100)">
        {/* Trunk */}
        <line x1="0" y1="540" x2="0" y2="0" stroke="#D2C5AF" strokeWidth="4" />
        {/* Branch right */}
        <path d="M0,400 Q60,400 90,320 L90,180" stroke="#B08968" strokeWidth="3" fill="none" opacity="0.7" />
        {/* Branch left */}
        <path d="M0,300 Q-60,300 -90,220 L-90,120" stroke="#B08968" strokeWidth="3" fill="none" opacity="0.55" />
        {/* Branch right 2 */}
        <path d="M0,200 Q50,200 70,130 L70,60" stroke="#B08968" strokeWidth="2" fill="none" opacity="0.45" />
        {/* Commit nodes */}
        <circle className="node-p" cx="0" cy="540" r="8" fill="#D2C5AF" />
        <circle cx="0" cy="400" r="8" fill="#B08968" opacity="0.7" />
        <circle cx="90" cy="180" r="8" fill="#B08968" opacity="0.7" />
        <circle cx="-90" cy="120" r="8" fill="#B08968" opacity="0.55" />
        <circle cx="70" cy="60" r="7" fill="#B08968" opacity="0.45" />
        <circle cx="0" cy="200" r="8" fill="#D2C5AF" />
        <circle cx="0" cy="100" r="8" fill="#B08968" />
        <circle cx="0" cy="0"   r="10" fill="#B08968" />
      </g>

      {/* ── Rocket (fires from top of git tree) ── */}
      <g className="rocket" transform="translate(600,380)">
        {/* Exhaust trail */}
        <rect className="exhaust-trail" x="-4" y="140" width="8" height="200" rx="4" fill="#94A0AB" />
        {/* Body */}
        <rect x="-44" y="-40" width="88" height="180" rx="12" fill="#ECE4D8" stroke="#D2C5AF" strokeWidth="3" />
        {/* Nose */}
        <path d="M-44,-40 Q0,-140 44,-40 Z" fill="#B08968" />
        {/* Window */}
        <circle className="win-blink" cx="0" cy="40" r="22" fill="#1E2A3A" opacity="0.7" />
        <circle cx="0" cy="40" r="15" fill="#52606D" opacity="0.5" />
        <circle cx="-5" cy="33" r="5" fill="#FAF7F2" opacity="0.55" />
        {/* Fins */}
        <path d="M-44,120 L-80,180 L-44,165 Z" fill="#D2C5AF" />
        <path d="M44,120  L80,180  L44,165  Z" fill="#D2C5AF" />
        {/* Flames */}
        <ellipse className="flame-m"  cx="0"   cy="155" rx="24" ry="48" fill="#B08968" opacity="0.9" />
        <ellipse className="flame-sl" cx="-32" cy="150" rx="14" ry="30" fill="#D2C5AF" opacity="0.7" />
        <ellipse className="flame-sr" cx="32"  cy="150" rx="14" ry="30" fill="#D2C5AF" opacity="0.7" />
        {/* Smoke */}
        <circle className="smoke-a" cx="-16" cy="200" r="18" fill="#94A0AB" opacity="0.45" />
        <circle className="smoke-b" cx="18"  cy="210" r="15" fill="#94A0AB" opacity="0.4" />
        <circle className="smoke-c" cx="0"   cy="225" r="22" fill="#94A0AB" opacity="0.35" />
      </g>

      {/* ── Commit ticker at bottom ── */}
      <rect x="0" y="638" width="1200" height="40" fill="#1E2A3A" opacity="0.07" />
      <g clipPath="url(#rc-clip)">
        <text className="ticker" y="664" fontSize="18" fontFamily="monospace" fill="#94A0AB" letterSpacing="1">
          git commit -m &quot;fix bug&quot; · git commit -m &quot;fix fix&quot; · git commit -m &quot;ok this time&quot; · git commit -m &quot;pls work&quot; · git commit -m &quot;.&quot; · git commit -m &quot;final FINAL v3&quot; · git commit -m &quot;🙏&quot; ·
        </text>
      </g>

      {/* Stars */}
      <circle cx="900" cy="80"  r="3" fill="#B08968" opacity="0.5" />
      <circle cx="1050" cy="160" r="2" fill="#B08968" opacity="0.4" />
      <circle cx="750" cy="50"  r="2" fill="#B08968" opacity="0.35" />
      <circle cx="1150" cy="300" r="3" fill="#B08968" opacity="0.3" />
      <circle cx="850" cy="220" r="2" fill="#B08968" opacity="0.3" />
      <circle cx="1000" cy="400" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="650" cy="120" r="2" fill="#B08968" opacity="0.3" />
      <circle cx="50"  cy="80"  r="2" fill="#B08968" opacity="0.3" />
      <circle cx="350" cy="500" r="2" fill="#B08968" opacity="0.2" />
      <circle cx="1180" cy="500" r="2" fill="#B08968" opacity="0.25" />

      </g>
    </svg>
  );
}
