'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  // Throttle to one read per animation frame and only set state when the
  // boolean actually flips, so scrolling doesn't re-render the nav continuously.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled((prev) => {
        const next = window.scrollY > 8;
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 px-16 pt-16 md:px-24">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/40 bg-paper/60 px-16 backdrop-blur-glass transition-[padding,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
          scrolled ? 'py-8 shadow-glass' : 'py-16 shadow-none'
        }`}
      >
        <Link
          href="/"
          // -my-12 preserves the pill's visual height while the wordmark's hit
          // area reaches the 44px minimum.
          className="-my-12 flex min-h-44 items-center font-display text-h3 text-ink"
          onClick={() => setOpen(false)}
        >
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
                  <span className="absolute inset-0 rounded-full bg-accent-subtle" />
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
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full motion-reduce:hidden" />
          </Link>
        </nav>

        <button
          type="button"
          // -mr-8 keeps the icon optically aligned with the pill edge while the
          // hit area grows to the 44px minimum.
          className="relative z-10 -mr-8 flex h-44 w-44 items-center justify-center text-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex">{open ? <X size={24} /> : <Menu size={24} />}</span>
        </button>
      </div>

      {open && (
          <nav
            className="mx-auto mt-8 flex max-w-5xl animate-nav-in flex-col gap-4 overflow-hidden rounded-3xl border border-white/40 bg-paper/70 px-16 py-16 shadow-glass backdrop-blur-glass md:hidden"
          >
            {NAV_GROUPS.map((item) => {
              const mobileActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-44 items-center rounded-full px-16 text-body transition-colors hover:bg-accent-subtle hover:text-ink ${mobileActive ? 'bg-accent-subtle text-ink' : 'text-ink-muted'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact?utm_source=header"
              onClick={() => setOpen(false)}
              className="mt-8 flex min-h-44 items-center justify-center rounded-full bg-accent px-16 text-center text-body text-paper"
            >
              Get in touch
            </Link>
          </nav>
        )}
    </header>
  );
}
