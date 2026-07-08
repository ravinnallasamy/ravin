'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, Inbox, Lock, RefreshCw } from 'lucide-react';

/** Full-page error state for total failure (`DashboardResult.ok === false`). */
export function DashboardErrorState({ error }: { error: string }) {
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
        <p className="max-w-md text-body text-ink-muted">{error}</p>
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

/** Shown when the dashboard isn't configured (no LEETCODE_USERNAME resolvable). */
export function DashboardUnconfiguredState() {
  return (
    <div className="flex flex-col items-center gap-16 rounded-3xl border border-border/60 bg-paper p-48 text-center shadow-neu">
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
        <Inbox size={24} aria-hidden />
      </div>
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-h3 text-ink">Dashboard not configured</h2>
        <p className="max-w-md text-body text-ink-muted">
          Set LEETCODE_USERNAME in your environment (or leetcodeUsername in content/social.json) to enable this
          dashboard.
        </p>
      </div>
    </div>
  );
}

/** Section-level state when a datapoint is public but not accessible without auth. */
export function NotPubliclyAvailableState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-8 py-32 text-center">
      <Lock size={20} className="text-ink-faint" aria-hidden />
      <p className="text-mono-label text-ink-faint">{message ?? 'Not publicly available for this user.'}</p>
    </div>
  );
}

/** Generic empty state for sections with no data (e.g. no submissions yet). */
export function EmptySectionState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-8 py-32 text-center">
      <Inbox size={20} className="text-ink-faint" aria-hidden />
      <p className="text-mono-label text-ink-faint">{message}</p>
    </div>
  );
}
