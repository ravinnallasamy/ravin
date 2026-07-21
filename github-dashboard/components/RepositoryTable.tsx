'use client';

import { useMemo, useState } from 'react';
import { Star, GitFork, Eye, CircleDot } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { EmptySectionState } from './DashboardStatus';
import { sortRepositories, type RepoSortKey } from '../utils/sort';
import type { Repository } from '../types';

const SORT_OPTIONS: { key: RepoSortKey; label: string }[] = [
  { key: 'updated', label: 'Recently updated' },
  { key: 'stars', label: 'Most stars' },
  { key: 'name', label: 'Alphabetical' },
];

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatSize(sizeKb: number): string {
  if (sizeKb < 1024) return `${sizeKb} KB`;
  return `${(sizeKb / 1024).toFixed(1)} MB`;
}

/**
 * Renders the PUBLIC repository list only — `repositories` here is already
 * filtered to exclude private repos upstream (see `lib/combine.ts`), so no
 * private repo name, link, or detail ever reaches this (client) component.
 */
export function RepositoryTable({ repositories }: { repositories: Repository[] }) {
  const [sortKey, setSortKey] = useState<RepoSortKey>('updated');

  const sorted = useMemo(() => sortRepositories(repositories, sortKey), [repositories, sortKey]);

  if (repositories.length === 0) {
    return (
      <DashboardCard eyebrow="Repositories" title="Public Repositories">
        <EmptySectionState message="No public repositories found." />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      eyebrow="Repositories"
      title={`Public Repositories (${repositories.length})`}
      action={
        <label className="flex items-center gap-8 self-start sm:self-auto">
          <span className="sr-only" id="repo-sort-label">
            Sort repositories
          </span>
          <select
            aria-labelledby="repo-sort-label"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as RepoSortKey)}
            className="rounded-full border border-border bg-paper px-12 py-8 font-mono text-mono-label text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      }
    >
      <div className="-mx-24 overflow-x-auto px-24 md:-mx-32 md:px-32">
        <table className="w-full min-w-[640px] border-collapse text-body">
          <caption className="sr-only">Public repositories across both GitHub accounts</caption>
          <thead>
            <tr className="border-b border-border text-left font-mono text-mono-label uppercase tracking-wide text-ink-faint">
              <th scope="col" className="py-8 pr-16">Name</th>
              <th scope="col" className="py-8 pr-16">Language</th>
              <th scope="col" className="py-8 pr-16">Stars</th>
              <th scope="col" className="py-8 pr-16">Forks</th>
              <th scope="col" className="py-8 pr-16">Watchers</th>
              <th scope="col" className="py-8 pr-16">Issues</th>
              <th scope="col" className="py-8 pr-16">Size</th>
              <th scope="col" className="py-8">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((repo) => (
              <tr key={repo.id} className="border-b border-border/40 last:border-0 hover:bg-surface/60">
                <td className="py-12 pr-16">
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:text-accent"
                  >
                    {repo.name}
                  </a>
                </td>
                <td className="py-12 pr-16 text-ink-muted">{repo.primaryLanguage ?? '—'}</td>
                <td className="py-12 pr-16 text-ink-muted">
                  <span className="inline-flex items-center gap-4">
                    <Star size={14} aria-hidden />
                    {repo.stargazers}
                  </span>
                </td>
                <td className="py-12 pr-16 text-ink-muted">
                  <span className="inline-flex items-center gap-4">
                    <GitFork size={14} aria-hidden />
                    {repo.forks}
                  </span>
                </td>
                <td className="py-12 pr-16 text-ink-muted">
                  <span className="inline-flex items-center gap-4">
                    <Eye size={14} aria-hidden />
                    {repo.watchers}
                  </span>
                </td>
                <td className="py-12 pr-16 text-ink-muted">
                  <span className="inline-flex items-center gap-4">
                    <CircleDot size={14} aria-hidden />
                    {repo.openIssues}
                  </span>
                </td>
                <td className="py-12 pr-16 text-ink-muted">{formatSize(repo.sizeKb)}</td>
                <td className="py-12 text-ink-muted">{formatDate(repo.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
