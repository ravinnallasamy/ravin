'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, Rss } from 'lucide-react';
import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';
import { getServices } from '@/lib/content/content';

const QUOTES = [
  'Build the thing that would have made your last project easier.',
  "Ship it, then make it right — perfect is the enemy of shipped.",
  'Great code is a byproduct of solving a problem you actually care about.',
];

const QUOTE_INTERVAL_MS = 3_000;

const CONTACT_LINKS = [
  { label: 'GitHub', href: socialJson.github, icon: Github },
  { label: 'LinkedIn', href: `https://${socialJson.linkedin}`, icon: Linkedin },
  { label: 'Email', href: `mailto:${socialJson.email}`, icon: Mail },
  { label: 'Call', href: `tel:${socialJson.phone.replace(/\s+/g, '')}`, icon: Phone },
  { label: 'Blog', href: '/blog', icon: Rss },
];

function isExternal(href: string) {
  return href.startsWith('http');
}

export function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const services = getServices();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, QUOTE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full px-16 pb-16 md:px-24">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-white/40 bg-surface/60 shadow-glass backdrop-blur-glass">
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
          className="relative grid grid-cols-1 md:grid-cols-2"
        >
          {/* Left column */}
          <div className="flex flex-col divide-y divide-border border-b border-border md:border-b-0 md:border-r">
            {/* Left / upper: name + designation */}
            <div className="flex flex-col justify-center px-16 py-24 md:px-32 md:py-32">
              <p className="font-display text-h2 text-ink">{siteJson.name}</p>
              <p className="mt-4 text-body text-ink-muted">
                {siteJson.role} · {siteJson.location}
              </p>
            </div>

            {/* Left / lower: rotating quotes */}
            <div className="flex flex-col justify-center px-16 py-24 md:px-32 md:py-32">
              <p className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">Perspective</p>
              <div className="relative mt-8 min-h-[4.5em] md:min-h-[3.5em]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="font-display text-h3 leading-snug text-ink"
                  >
                    &ldquo;{QUOTES[quoteIndex]}&rdquo;
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="mt-12 flex gap-6" aria-hidden>
                {QUOTES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      i === quoteIndex ? 'w-24 bg-accent' : 'w-8 bg-ink-faint/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col divide-y divide-border">
            {/* Right / upper: services */}
            <div className="flex flex-col justify-center px-16 py-24 md:px-32 md:py-32">
              <p className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">What I do</p>
              <ul className="mt-12 flex flex-wrap gap-8">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="rounded-full border border-border bg-paper/70 px-16 py-8 text-body text-ink-muted transition-colors hover:border-accent hover:text-ink"
                  >
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right / lower: labeled contact icons */}
            <div className="flex flex-col justify-center px-16 py-24 md:px-32 md:py-32">
              <p className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">Get in touch</p>
              <div className="mt-12 flex flex-wrap gap-8">
                {CONTACT_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target={isExternal(href) ? '_blank' : undefined}
                    rel={isExternal(href) ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    title={label}
                    className="group flex items-center gap-8 rounded-full border border-border bg-paper/70 py-8 pl-8 pr-16 text-body text-ink-muted transition-colors hover:border-accent hover:bg-accent-subtle hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent group-hover:bg-paper sm:h-[26px] sm:w-[26px] md:h-[28px] md:w-[28px]">
                      <Icon className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px] md:h-[15px] md:w-[15px]" strokeWidth={1.8} />
                    </span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative flex flex-col gap-8 border-t border-border px-16 py-16 text-mono-label font-mono text-ink-faint sm:flex-row sm:items-center sm:justify-between md:px-32">
          <p>
            © {new Date().getFullYear()} {siteJson.name}. All rights reserved.
          </p>
          <p>{socialJson.phone}</p>
        </div>
      </div>
    </footer>
  );
}
