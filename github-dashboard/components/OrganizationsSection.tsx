/* eslint-disable @next/next/no-img-element */
import { DashboardCard } from './DashboardCard';
import { EmptySectionState } from './DashboardStatus';
import type { Organization } from '../types';

export function OrganizationsSection({ organizations }: { organizations: Organization[] }) {
  if (organizations.length === 0) {
    return (
      <DashboardCard eyebrow="Network" title="Organizations">
        <EmptySectionState message="Not a member of any organizations." />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard eyebrow="Network" title={`Organizations (${organizations.length})`}>
      <ul className="grid grid-cols-2 gap-16 sm:grid-cols-3 md:grid-cols-4">
        {organizations.map((org) => (
          <li key={org.id} className="min-w-0">
            <a
              href={`https://github.com/${org.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 flex-col items-center gap-8 rounded-2xl border border-border/50 bg-surface p-16 text-center transition-colors hover:border-accent"
            >
              <img src={org.avatarUrl} alt="" className="h-48 w-48 shrink-0 rounded-full" loading="lazy" />
              <span className="max-w-full truncate text-mono-label font-mono text-ink">{org.login}</span>
              {org.description && (
                <span className="line-clamp-2 text-mono-label text-ink-faint">{org.description}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
