'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

export function ContactCtaButton() {
  const pathname = usePathname();
  
  // Determine UTM source based on route path
  let utmSource = 'unknown';
  if (pathname === '/') {
    utmSource = 'home';
  } else if (pathname) {
    if (pathname.startsWith('/blog/')) {
      utmSource = pathname.replace('/blog/', 'blog:');
    } else {
      utmSource = pathname.replace(/^\//, '');
    }
  }

  const href = `/contact?utm_source=${utmSource}`;

  return (
    <MotionLink
      href={href}
      className="inline-flex items-center gap-12 rounded-full bg-accent px-24 py-12 text-body font-medium text-paper shadow-glass transition-colors hover:bg-accent-hover hover:text-paper cursor-pointer"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <span>Get in touch</span>
        {/* Animated Envelope SVG */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Back flap */}
          <rect x="10" y="24" width="44" height="32" rx="3" fill="#D2C5AF" stroke="#B08968" strokeWidth="2" />
          
          {/* Letter */}
          <motion.g
            variants={{
              rest: { y: 0 },
              hover: { y: -14, transition: { delay: 0.1, duration: 0.3, ease: 'easeOut' } }
            }}
          >
            <rect x="14" y="26" width="36" height="26" rx="2" fill="#FAF7F2" stroke="#B08968" strokeWidth="1.5" />
            <line x1="20" y1="32" x2="44" y2="32" stroke="#B08968" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="38" x2="38" y2="38" stroke="#B08968" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="44" x2="30" y2="44" stroke="#B08968" strokeWidth="1.5" strokeLinecap="round" />
            {/* Pulsing red heart */}
            <path
              d="M 42 41 C 41 39.5, 39.5 39.5, 38.5 40.5 C 37.5 39.5, 36 39.5, 35 40.5 C 34 42.5, 34 44.5, 38.5 48.5 C 43 44.5, 43 42.5, 42 41 Z"
              fill="#E05A47"
            />
          </motion.g>

          {/* Front cover */}
          <path
            d="M 10 24 L 32 38 L 54 24 L 54 56 L 10 56 Z"
            fill="#ECE4D8"
            stroke="#B08968"
            strokeWidth="2"
          />

          {/* Flap */}
          <motion.path
            variants={{
              rest: { d: "M 10 24 L 32 38 L 54 24", fill: "#ECE4D8" },
              hover: { d: "M 10 24 L 32 10 L 54 24", fill: "#FAF7F2", transition: { duration: 0.2 } }
            }}
            stroke="#B08968"
            strokeWidth="2"
          />
        </svg>
    </MotionLink>
  );
}
