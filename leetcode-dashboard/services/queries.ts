import 'server-only';

/**
 * GraphQL documents for LeetCode's public endpoint.
 *
 * Every query below was verified against https://leetcode.com/graphql without
 * auth. Where a field is public but can legitimately come back null/empty (the
 * whole `userContestRanking` object for users who never competed), the service
 * layer maps that to `unavailable`, never a failure.
 */

/**
 * Combined profile + problem-solving stats. `allQuestionsCount` is a top-level
 * field (no username) fetched in the same round-trip to give per-difficulty
 * totals available on the platform.
 */
export const PROFILE_QUERY = /* GraphQL */ `
  query Profile($username: String!) {
    matchedUser(username: $username) {
      username
      githubUrl
      twitterUrl
      linkedinUrl
      profile {
        realName
        userAvatar
        ranking
        reputation
        countryName
        aboutMe
        school
        websites
        skillTags
        postViewCount
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

/**
 * Submission calendar (heatmap). `submissionCalendar` is a JSON string keyed by
 * unix-second timestamps; the normaliser parses it. `year` is optional — omit
 * for LeetCode's default rolling window.
 */
export const CALENDAR_QUERY = /* GraphQL */ `
  query Calendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

/**
 * Contest standing + full attended history. Both fields are null/empty for
 * users who never joined a contest → the service returns `unavailable`.
 */
export const CONTEST_QUERY = /* GraphQL */ `
  query Contest($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      contest {
        title
        startTime
      }
    }
  }
`;

/** Recent accepted submissions. `timestamp` is a unix-seconds string. */
export const RECENT_QUERY = /* GraphQL */ `
  query Recent($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

/** Topic-tag solve counts, bucketed by mastery level. */
export const TOPICS_QUERY = /* GraphQL */ `
  query Topics($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`;
