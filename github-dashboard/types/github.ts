/**
 * Normalised shapes for raw GitHub entities.
 *
 * These are NOT the verbatim API payloads — the service layer maps GitHub's
 * responses into these lean, stable interfaces so the rest of the module
 * (merge utils, aggregation, UI) never depends on GitHub's wire format.
 */

import type { AccountKey } from '../constants';

/** A GitHub user/owner profile. */
export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  publicGists: number;
  createdAt: string; // ISO-8601
}

/** Language byte-breakdown for a single repository. */
export interface RepositoryLanguages {
  /** Language name -> bytes of code. */
  bytes: Record<string, number>;
}

/** A normalised repository. */
export interface Repository {
  id: number;
  nodeId: string;
  name: string;
  fullName: string; // "owner/name"
  htmlUrl: string;
  description: string | null;
  isFork: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  stargazers: number;
  watchers: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string | null;
  /** Per-language byte counts (from the languages endpoint). */
  languages: RepositoryLanguages;
  topics: string[];
  sizeKb: number;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
  pushedAt: string | null; // ISO-8601
  /** Which configured account owns this repo. */
  sourceAccount: AccountKey;
}

/** A single day in the contribution calendar. */
export interface ContributionDay {
  date: string; // ISO date "YYYY-MM-DD"
  count: number;
  /** GitHub intensity level 0-4; recomputed after a merge. */
  level: 0 | 1 | 2 | 3 | 4;
}

/** A calendar week (GitHub weeks start on Sunday). */
export interface ContributionWeek {
  /** ISO date of the week's first day. */
  firstDay: string;
  days: ContributionDay[];
}

/** The rolling-year contribution calendar. */
export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

/** A public activity event (push, PR, issue, etc.). */
export interface ActivityEvent {
  id: string;
  type: string; // e.g. "PushEvent"
  repoName: string; // "owner/name"
  createdAt: string; // ISO-8601
  sourceAccount: AccountKey;
}

/** An organisation the user belongs to. */
export interface Organization {
  id: number;
  login: string;
  avatarUrl: string;
  description: string | null;
}

/** A follower/following user reference. */
export interface FollowerRef {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
}

/** Contribution collection totals for a single account (GraphQL). */
export interface ContributionTotals {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoryContributions: number;
}

/**
 * Everything fetched for ONE account, before merging.
 * Every field is populated per account then combined by the merge utils.
 */
export interface AccountData {
  account: AccountKey;
  profile: GitHubUser;
  repositories: Repository[];
  contributionCalendar: ContributionCalendar;
  contributionTotals: ContributionTotals;
  events: ActivityEvent[];
  organizations: Organization[];
  followers: FollowerRef[];
}
