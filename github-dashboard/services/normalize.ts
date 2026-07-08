import 'server-only';

/**
 * Maps raw GitHub REST/GraphQL payloads into the module's normalised types.
 * Kept separate from fetching so the wire format is isolated to one place.
 * Raw shapes are declared locally (partial, only the fields we consume).
 */

import type {
  ActivityEvent,
  ContributionCalendar,
  ContributionDay,
  FollowerRef,
  GitHubUser,
  Organization,
  Repository,
} from '../types';
import type { AccountKey } from '../constants';

/* ------------------------------ raw shapes ------------------------------ */

export interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
}

export interface RawRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  private: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface RawEvent {
  id: string;
  type: string | null;
  repo: { name: string };
  created_at: string;
}

export interface RawOrg {
  id: number;
  login: string;
  avatar_url: string;
  description: string | null;
}

export interface RawFollower {
  login: string;
  avatar_url: string;
  html_url: string;
}

/** GraphQL contributionCalendar shape. */
export interface RawContributionCalendar {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      date: string;
      contributionCount: number;
      weekday: number;
    }>;
  }>;
}

/* ------------------------------ normalisers ----------------------------- */

export function normalizeUser(raw: RawUser): GitHubUser {
  return {
    login: raw.login,
    name: raw.name,
    avatarUrl: raw.avatar_url,
    htmlUrl: raw.html_url,
    bio: raw.bio,
    company: raw.company,
    location: raw.location,
    followers: raw.followers,
    following: raw.following,
    publicRepos: raw.public_repos,
    publicGists: raw.public_gists,
    createdAt: raw.created_at,
  };
}

/**
 * @param languages per-language byte map from the repo's languages endpoint;
 *                  pass `{}` when not fetched.
 */
export function normalizeRepo(
  raw: RawRepo,
  sourceAccount: AccountKey,
  languages: Record<string, number>,
): Repository {
  return {
    id: raw.id,
    nodeId: raw.node_id,
    name: raw.name,
    fullName: raw.full_name,
    htmlUrl: raw.html_url,
    description: raw.description,
    isFork: raw.fork,
    isArchived: raw.archived,
    isPrivate: raw.private,
    stargazers: raw.stargazers_count,
    watchers: raw.watchers_count,
    forks: raw.forks_count,
    openIssues: raw.open_issues_count,
    primaryLanguage: raw.language,
    languages: { bytes: languages },
    topics: raw.topics ?? [],
    sizeKb: raw.size,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
    sourceAccount,
  };
}

export function normalizeEvent(
  raw: RawEvent,
  sourceAccount: AccountKey,
): ActivityEvent {
  return {
    id: raw.id,
    type: raw.type ?? 'UnknownEvent',
    repoName: raw.repo.name,
    createdAt: raw.created_at,
    sourceAccount,
  };
}

export function normalizeOrg(raw: RawOrg): Organization {
  return {
    id: raw.id,
    login: raw.login,
    avatarUrl: raw.avatar_url,
    description: raw.description,
  };
}

export function normalizeFollower(raw: RawFollower): FollowerRef {
  return {
    login: raw.login,
    avatarUrl: raw.avatar_url,
    htmlUrl: raw.html_url,
  };
}

/**
 * Normalises the GraphQL contribution calendar. Levels are set to 0 here and
 * (re)computed during merge, since the merged max determines the buckets.
 */
export function normalizeCalendar(
  raw: RawContributionCalendar,
): ContributionCalendar {
  return {
    totalContributions: raw.totalContributions,
    weeks: raw.weeks.map((week) => ({
      firstDay: week.contributionDays[0]?.date ?? '',
      days: week.contributionDays.map(
        (d): ContributionDay => ({
          date: d.date,
          count: d.contributionCount,
          level: 0,
        }),
      ),
    })),
  };
}
