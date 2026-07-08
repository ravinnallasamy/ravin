import 'server-only';

/**
 * Fetches EVERYTHING for a single account and returns normalised AccountData.
 * All GitHub I/O for one account funnels through here. On failure it throws a
 * classified error; the orchestrating service catches per-account so one
 * account failing never blanks the other.
 */

import type { AccountData, ContributionTotals } from '../types';
import type { AccountCredentials } from '../constants/env';
import { GitHubHttpClient } from './http-client';
import { CONTRIBUTIONS_QUERY } from './queries';
import {
  normalizeCalendar,
  normalizeEvent,
  normalizeFollower,
  normalizeOrg,
  normalizeRepo,
  normalizeUser,
  type RawContributionCalendar,
  type RawEvent,
  type RawFollower,
  type RawOrg,
  type RawRepo,
  type RawUser,
} from './normalize';

/** Cap on how many recent public events we keep per account. */
const EVENTS_LIMIT = 100;

interface ContributionsGraphQL {
  user: {
    contributionsCollection: ContributionTotals & {
      contributionCalendar: RawContributionCalendar;
    };
  } | null;
}

export async function fetchAccountData(
  creds: AccountCredentials,
  revalidateSeconds: number,
): Promise<AccountData> {
  const client = new GitHubHttpClient(creds.key, creds.token, {
    revalidateSeconds,
  });
  const perPage = GitHubHttpClient.perPage();

  // Fetch top-level resources in parallel. Repo languages depend on the repo
  // list, so those are fetched in a second wave below.
  const [rawUser, rawRepos, rawEvents, rawOrgs, rawFollowers, contrib] =
    await Promise.all([
      client.getJson<RawUser>(`/users/${creds.username}`),
      client.getPaginated<RawRepo>(
        `/users/${creds.username}/repos?${perPage}&type=owner&sort=pushed`,
      ),
      client.getJson<RawEvent[]>(
        `/users/${creds.username}/events/public?${perPage}`,
      ),
      client.getPaginated<RawOrg>(`/users/${creds.username}/orgs?${perPage}`),
      client.getPaginated<RawFollower>(
        `/users/${creds.username}/followers?${perPage}`,
      ),
      client.graphql<ContributionsGraphQL>(CONTRIBUTIONS_QUERY, {
        login: creds.username,
      }),
    ]);

  // Second wave: per-repo language byte maps (skip forks/archived to limit
  // request volume — they don't reflect authored language work).
  const languageMaps = await Promise.all(
    rawRepos.map(async (repo) => {
      if (repo.fork || repo.archived) return {} as Record<string, number>;
      try {
        return await client.getJson<Record<string, number>>(
          `/repos/${repo.full_name}/languages`,
        );
      } catch {
        // A single repo's languages failing must not fail the account.
        return {} as Record<string, number>;
      }
    }),
  );

  const repositories = rawRepos.map((repo, i) =>
    normalizeRepo(repo, creds.key, languageMaps[i]),
  );

  const collection = contrib.user?.contributionsCollection;
  const contributionTotals: ContributionTotals = {
    totalCommitContributions: collection?.totalCommitContributions ?? 0,
    totalPullRequestContributions:
      collection?.totalPullRequestContributions ?? 0,
    totalIssueContributions: collection?.totalIssueContributions ?? 0,
    totalPullRequestReviewContributions:
      collection?.totalPullRequestReviewContributions ?? 0,
    totalRepositoryContributions:
      collection?.totalRepositoryContributions ?? 0,
  };

  const contributionCalendar = collection
    ? normalizeCalendar(collection.contributionCalendar)
    : { totalContributions: 0, weeks: [] };

  return {
    account: creds.key,
    profile: normalizeUser(rawUser),
    repositories,
    contributionCalendar,
    contributionTotals,
    events: rawEvents.slice(0, EVENTS_LIMIT).map((e) => normalizeEvent(e, creds.key)),
    organizations: rawOrgs.map(normalizeOrg),
    followers: rawFollowers.map(normalizeFollower),
  };
}
