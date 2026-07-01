'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';

const LINKS = [
  { label: 'GitHub', href: socialJson.github },
  { label: 'LinkedIn', href: `https://${socialJson.linkedin}` },
  { label: 'Email', href: `mailto:${socialJson.email}` },
];

export function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="px-16 pb-16 md:px-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-surface/60 shadow-glass backdrop-blur-glass">
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-1/2 left-0 h-[200%] w-[40%] bg-gradient-to-r from-transparent via-accent/10 to-transparent"
            animate={{ x: ['-20%', '320%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative flex flex-col gap-16 px-16 py-48 md:flex-row md:items-center md:justify-between md:px-24"
        >
          <div>
            <p className="font-display text-h3 text-ink">{siteJson.name}</p>
            <p className="text-body text-ink-muted">
              {siteJson.role} · {siteJson.location}
            </p>
          </div>
          <div className="flex gap-24 text-body text-ink-muted">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="relative transition-colors hover:text-ink [&:hover>span]:scale-x-100"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
