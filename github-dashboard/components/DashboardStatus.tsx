'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import type { AccountError } from '../types';

/** Full-page error state for total failure (`DashboardResult.ok === false`). */
export function DashboardErrorState({ error }: { error: AccountError }) {
  const router = useRouter();

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-16 rounded-3xl border border-border/60 bg-paper p-48 text-center shadow-neu"
    >
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-signal/10 text-signal">
        <AlertTriangle size={24} aria-hidden />
      </div>
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-h3 text-ink">Couldn&apos;t load the dashboard</h2>
        <p className="max-w-md text-body text-ink-muted">{error.message}</p>
        <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">{error.kind}</span>
      </div>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="group inline-flex items-center gap-8 rounded-full bg-accent px-16 py-8 text-body text-paper transition-colors hover:bg-accent-hover"
      >
        <RefreshCw size={16} aria-hidden />
        Retry
      </button>
    </div>
  );
}

/** Shown when the dashboard isn't configured (no env vars set). */
export function DashboardUnconfiguredState() {
  return (
    <div className="flex flex-col items-center gap-16 rounded-3xl border border-border/60 bg-paper p-48 text-center shadow-neu">
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
        <Inbox size={24} aria-hidden />
      </div>
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-h3 text-ink">Dashboard not configured</h2>
        <p className="max-w-md text-body text-ink-muted">
          Set at least one GitHub account&apos;s username and token in your environment to enable this dashboard.
        </p>
      </div>
    </div>
  );
}

/** Inline banner for partial data (one account failed, the other loaded). */
export function PartialDataBanner({ errors }: { errors: AccountError[] }) {
  if (errors.length === 0) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-12 rounded-2xl border border-signal/30 bg-signal/10 px-16 py-12 text-mono-label font-mono text-signal"
    >
      <AlertTriangle size={16} aria-hidden />
      <span>
        {errors.length === 1
          ? `Account "${errors[0].account}" failed to load (${errors[0].kind}). Showing partial data.`
          : `${errors.length} accounts failed to load. Showing partial data.`}
      </span>
    </div>
  );
}

/** Generic empty state for sections with no data (e.g. no repos, no orgs). */
export function EmptySectionState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-8 py-32 text-center">
      <Inbox size={20} className="text-ink-faint" aria-hidden />
      <p className="text-mono-label text-ink-faint">{message}</p>
    </div>
  );
}
