import type { ProjectStatus } from '@/lib/content';

const STYLES: Record<ProjectStatus, string> = {
  shipped: 'bg-accent-subtle text-accent',
  'in-progress': 'bg-signal/10 text-signal',
  archived: 'bg-surface-raised text-ink-faint',
};

const LABELS: Record<ProjectStatus, string> = {
  shipped: 'shipped',
  'in-progress': 'in-progress',
  archived: 'archived',
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-12 py-4 font-mono text-mono-label ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
