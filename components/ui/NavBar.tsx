'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import siteJson from '@/content/site.json';

const NAV_GROUPS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Skills & Services', href: '/skills-services' },
  { label: 'Experience & Education', href: '/experience-education' },
  { label: 'Coding', href: '/coding' },
  { label: 'Blog', href: '/blog' },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 px-16 pt-16 md:px-24">
      <motion.div
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/40 bg-paper/60 px-16 backdrop-blur-glass transform-gpu [backface-visibility:hidden] ${
          mounted ? 'transition-shadow' : ''
        } ${scrolled ? 'shadow-glass' : 'shadow-none'}`}
        style={{ willChange: 'transform' }}
        animate={{ paddingTop: scrolled ? 8 : 16, paddingBottom: scrolled ? 8 : 16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Link href="/" className="font-display text-h3 text-ink" onClick={() => setOpen(false)}>
          {siteJson.name.split(' ')[0]}
        </Link>

        <nav className="hidden items-center gap-4 lg:gap-8 md:flex">
          {NAV_GROUPS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-8 lg:px-12 xl:px-16 py-8 text-body transition-colors ${
                  active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layout={mounted ? 'position' : false}
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-accent-subtle transform-gpu"
                    style={{ willChange: 'transform' }}
                    transition={
                      mounted && !shouldReduceMotion
                        ? { type: 'spring', stiffness: 380, damping: 32 }
                        : { duration: 0 }
                    }
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/contact?utm_source=header"
            className="group relative ml-8 overflow-hidden rounded-full bg-accent px-16 py-8 text-body text-paper transition-colors hover:bg-accent-hover"
          >
            <span className="relative">Get in touch</span>
            {!shouldReduceMotion && (
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            )}
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-10 text-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto mt-8 flex max-w-5xl flex-col gap-4 overflow-hidden rounded-3xl border border-white/40 bg-paper/70 px-16 py-16 shadow-glass backdrop-blur-glass md:hidden"
          >
            {NAV_GROUPS.map((item) => {
              const mobileActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-8 py-8 text-body transition-colors hover:bg-accent-subtle hover:text-ink ${mobileActive ? 'bg-accent-subtle text-ink' : 'text-ink-muted'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact?utm_source=header"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full bg-accent px-16 py-8 text-center text-body text-paper"
            >
              Get in touch
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
