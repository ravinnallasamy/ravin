/** Repository sorting/selection helpers. Pure, non-mutating. */

import type { Repository } from '../types';

export type RepoSortKey =
  | 'stars'
  | 'forks'
  | 'updated'
  | 'created'
  | 'pushed'
  | 'name';

const comparators: Record<RepoSortKey, (a: Repository, b: Repository) => number> = {
  stars: (a, b) => b.stargazers - a.stargazers,
  forks: (a, b) => b.forks - a.forks,
  name: (a, b) => a.name.localeCompare(b.name),
  updated: (a, b) => timeDesc(a.updatedAt, b.updatedAt),
  created: (a, b) => timeDesc(a.createdAt, b.createdAt),
  pushed: (a, b) => timeDesc(a.pushedAt, b.pushedAt),
};

function timeDesc(a: string | null, b: string | null): number {
  return (b ? Date.parse(b) : 0) - (a ? Date.parse(a) : 0);
}

/** Returns a new array sorted by the given key (does not mutate input). */
export function sortRepositories(
  repos: Repository[],
  key: RepoSortKey = 'stars',
): Repository[] {
  return repos.slice().sort(comparators[key]);
}

/** Top-N repositories by a sort key. */
export function topRepositories(
  repos: Repository[],
  n: number,
  key: RepoSortKey = 'stars',
): Repository[] {
  return sortRepositories(repos, key).slice(0, n);
}
