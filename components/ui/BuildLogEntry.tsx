'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { hashSlug } from '@/lib/utils/hash';
import { StatusPill } from './StatusPill';
import type { ProjectStatus } from '@/lib/content/content';

type BuildLogEntryProps = {
  slug: string;
  href?: string;
  summary: string;
  status?: ProjectStatus;
  date?: string;
  children?: React.ReactNode;
};

const BORDER_ACCENT: Record<ProjectStatus, string> = {
  shipped: 'border-l-accent',
  'in-progress': 'border-l-signal',
  archived: 'border-l-border-strong',
};

export function BuildLogEntry({ slug, href, summary, status, date, children }: BuildLogEntryProps) {
  const [open, setOpen] = useState(false);
  const hash = hashSlug(slug);

  return (
    <div
      className={`rounded-2xl bg-surface p-24 shadow-neu transition-shadow duration-200 hover:shadow-neu-inset md:p-32 ${status ? `border-l-4 ${BORDER_ACCENT[status]}` : ''}`}
    >
      <div className="flex flex-wrap items-center gap-12">
        <span className="rounded-full bg-accent-subtle px-12 py-4 font-mono text-mono-label text-accent">
          {hash}
        </span>
        {status && <StatusPill status={status} />}
        {date && <span className="font-mono text-mono-label text-ink-faint">{date}</span>}
        <div className="ml-auto flex items-center gap-12">
          {href && (
            <Link href={href} className="text-mono-label font-mono text-accent hover:text-accent-hover">
              view
            </Link>
          )}
          {children && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex items-center gap-4 text-ink-muted hover:text-ink"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>

      <p className="mt-16 text-body text-ink">
        {href ? (
          <Link href={href} className="hover:text-accent">
            {summary}
          </Link>
        ) : (
          summary
        )}
      </p>

      {children && open && <div className="mt-16 border-t border-border pt-16">{children}</div>}
    </div>
  );
}
