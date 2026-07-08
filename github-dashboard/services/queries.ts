import 'server-only';

/** GraphQL documents. GraphQL is used only where REST can't serve us the
 * contribution calendar. */

/**
 * Fetches the rolling-year contribution calendar plus contribution totals
 * for one user. `from`/`to` are optional ISO datetimes; omit for the default
 * trailing year GitHub returns.
 */
export const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query Contributions($login: String!) {
    user(login: $login) {
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;
