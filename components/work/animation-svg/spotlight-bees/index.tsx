'use client';

// Full-section background: bees flying from edges converging on a centre spotlight
export function SpotlightBees() {
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
          .spot-cone   { animation: spot-flicker 3s ease-in-out infinite; }
          .spot-cone-2 { animation: spot-flicker 3s ease-in-out infinite 1.5s; }
          .bee-a { animation: bee-orbit-a 8s ease-in-out infinite; }
          .bee-b { animation: bee-orbit-b 9s ease-in-out infinite 1s; }
          .bee-c { animation: bee-orbit-c 7s ease-in-out infinite 2s; }
          .bee-d { animation: bee-orbit-d 10s ease-in-out infinite 0.5s; }
          .bee-e { animation: bee-orbit-e 8.5s ease-in-out infinite 3s; }
          .bee-f { animation: bee-orbit-f 7.5s ease-in-out infinite 1.5s; }
          .bee-g { animation: bee-orbit-g 9.5s ease-in-out infinite 2.5s; }
          .bee-h { animation: bee-orbit-h 8s ease-in-out infinite 4s; }
          .bee-i { animation: bee-orbit-a 8.8s ease-in-out infinite 0.8s; }
          .bee-j { animation: bee-orbit-b 7.6s ease-in-out infinite 2.2s; }
          .bee-k { animation: bee-orbit-c 9.2s ease-in-out infinite 3.6s; }
          .bee-l { animation: bee-orbit-d 8.4s ease-in-out infinite 1.4s; }
          .wing-a { animation: wing-beat 0.1s linear infinite alternate; }
          .wing-b { animation: wing-beat 0.1s linear infinite alternate-reverse; }
          .star-p { animation: star-pop 2.4s ease-in-out infinite; }
          .star-q { animation: star-pop 2.4s ease-in-out infinite 0.8s; }
          .star-r { animation: star-pop 2.4s ease-in-out infinite 1.6s; }
        }
        @keyframes spot-flicker {
          0%,100% { opacity:0.18; } 45% { opacity:0.12; } 50% { opacity:0.08; } 55% { opacity:0.16; }
        }
        @keyframes bee-orbit-a {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(60px,-40px); }
          50%  { transform: translate(120px,20px); }
          75%  { transform: translate(60px,50px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-b {
          0%   { transform: translate(0,0); }
          30%  { transform: translate(-80px,30px); }
          60%  { transform: translate(-40px,-60px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-c {
          0%   { transform: translate(0,0); }
          20%  { transform: translate(50px,70px); }
          50%  { transform: translate(-30px,90px); }
          80%  { transform: translate(-60px,20px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-d {
          0%   { transform: translate(0,0); }
          35%  { transform: translate(-90px,-50px); }
          65%  { transform: translate(30px,-80px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-e {
          0%   { transform: translate(0,0); }
          40%  { transform: translate(100px,60px); }
          80%  { transform: translate(40px,-30px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-f {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(-70px,80px); }
          75%  { transform: translate(80px,40px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-g {
          0%   { transform: translate(0,0); }
          33%  { transform: translate(-100px,-30px); }
          66%  { transform: translate(50px,-90px); }
          100% { transform: translate(0,0); }
        }
        @keyframes bee-orbit-h {
          0%   { transform: translate(0,0); }
          50%  { transform: translate(120px,-70px); }
          100% { transform: translate(0,0); }
        }
        @keyframes wing-beat { from { transform:scaleY(1); } to { transform:scaleY(0.2); } }
        @keyframes star-pop {
          0%,100% { opacity:0.15; r:3; } 50% { opacity:0.7; r:5; }
        }
      `}</style>

      <defs>
        <clipPath id="sb-safe"><rect width="1200" height="700" /></clipPath>
      </defs>
      <g clipPath="url(#sb-safe)">

      {/* Spotlight cones from top corners */}
      <g className="spot-cone">
        <polygon points="180,0 0,700 500,700"  fill="#B08968" opacity="0.18" />
        <polygon points="120,0 0,700 350,700"  fill="#B08968" opacity="0.08" />
      </g>
      <g className="spot-cone-2">
        <polygon points="1020,0 700,700 1200,700" fill="#B08968" opacity="0.18" />
        <polygon points="1080,0 850,700 1200,700" fill="#B08968" opacity="0.08" />
      </g>

      {/* Stage floor */}
      <line x1="0" y1="680" x2="1200" y2="680" stroke="#D2C5AF" strokeWidth="1" opacity="0.3" />

      {/* Scattered stars */}
      <circle className="star-p" cx="200"  cy="80"  r="3" fill="#B08968" />
      <circle className="star-q" cx="600"  cy="50"  r="4" fill="#B08968" />
      <circle className="star-r" cx="1000" cy="100" r="3" fill="#B08968" />
      <circle cx="80"  cy="200" r="2" fill="#B08968" opacity="0.3" />
      <circle cx="400" cy="130" r="2" fill="#B08968" opacity="0.3" />
      <circle cx="800" cy="60"  r="2" fill="#B08968" opacity="0.3" />
      <circle cx="1100" cy="180" r="2" fill="#B08968" opacity="0.3" />
      <circle cx="30"  cy="350" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="280" cy="40"  r="2" fill="#B08968" opacity="0.3" />
      <circle cx="520" cy="650" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="950" cy="630" r="3" fill="#B08968" opacity="0.3" />
      <circle cx="1170" cy="380" r="2" fill="#B08968" opacity="0.25" />
      <circle cx="20"  cy="600" r="2" fill="#B08968" opacity="0.2" />

      {/* Bees spread across the canvas */}
      <Bee cx={150}  cy={200} wc="bee-a" />
      <Bee cx={350}  cy={500} wc="bee-b" />
      <Bee cx={550}  cy={150} wc="bee-c" />
      <Bee cx={700}  cy={450} wc="bee-d" />
      <Bee cx={900}  cy={200} wc="bee-e" />
      <Bee cx={1000} cy={500} wc="bee-f" />
      <Bee cx={250}  cy={580} wc="bee-g" />
      <Bee cx={750}  cy={570} wc="bee-h" />
      <Bee cx={60}   cy={420} wc="bee-i" />
      <Bee cx={450}  cy={320} wc="bee-j" />
      <Bee cx={1130} cy={350} wc="bee-k" />
      <Bee cx={1080} cy={120} wc="bee-l" />

      </g>
    </svg>
  );
}

function Bee({ cx, cy, wc }: { cx: number; cy: number; wc: string }) {
  return (
    <g transform={`translate(${cx},${cy})`} className={wc}>
      <ellipse rx="18" ry="11" fill="#B08968" />
      <line x1="-7"  y1="-9" x2="-7"  y2="9" stroke="#1E2A3A" strokeWidth="3" opacity="0.4" />
      <line x1="2"   y1="-9" x2="2"   y2="9" stroke="#1E2A3A" strokeWidth="3" opacity="0.4" />
      <line x1="10"  y1="-7" x2="10"  y2="7" stroke="#1E2A3A" strokeWidth="3" opacity="0.4" />
      <ellipse className="wing-a" cx="-4"  cy="-13" rx="9"  ry="6" fill="#E2D9CB" opacity="0.8" />
      <ellipse className="wing-b" cx="7"   cy="-13" rx="9"  ry="6" fill="#E2D9CB" opacity="0.8" />
      <path d="M-18,0 L-26,-2 L-26,2 Z" fill="#94A0AB" />
      <circle cx="15" cy="-2" r="2.5" fill="#1E2A3A" />
    </g>
  );
}
