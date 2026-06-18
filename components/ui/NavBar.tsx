'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import siteJson from '@/content/site.json';

const NAV_GROUPS = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Coding', href: '/coding' },
  { label: 'Blog', href: '/blog' },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-16 py-16 md:px-24">
        <Link href="/" className="font-display text-h3 text-ink" onClick={() => setOpen(false)}>
          {siteJson.name.split(' ')[0]}
        </Link>

        <nav className="hidden items-center gap-32 md:flex">
          {NAV_GROUPS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-body transition-colors ${active ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="rounded-full bg-accent px-16 py-8 text-body text-paper hover:bg-accent-hover"
          >
            Get in touch
          </Link>
        </nav>

        <button
          type="button"
          className="text-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-16 py-16 md:hidden">
          {NAV_GROUPS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-8 py-8 text-body text-ink-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-8 rounded-full bg-accent px-16 py-8 text-center text-body text-paper"
          >
            Get in touch
          </Link>
        </nav>
      )}
    </header>
  );
}
