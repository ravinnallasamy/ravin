/**
 * Raw LeetCode GraphQL response shapes.
 *
 * These are the verbatim wire formats returned by the public GraphQL endpoint,
 * declared partial (only the fields we consume). Every `Raw*` type is isolated
 * here so the wire format touches exactly one other place: `services/normalize`.
 * The rest of the module depends only on the normalised models in `./models`.
 *
 * All shapes below were verified against the live endpoint; fields that come
 * back `null` for users without that data are typed nullable accordingly.
 */

/** `matchedUser.profile` sub-object. */
export interface RawUserProfile {
  realName: string | null;
  userAvatar: string | null;
  ranking: number | null;
  reputation: number | null;
  countryName: string | null;
  aboutMe: string | null;
  school: string | null;
  websites: string[] | null;
  skillTags: string[] | null;
  postViewCount: number | null;
}

/** One row of `submitStatsGlobal.acSubmissionNum`. `difficulty` is All|Easy|Medium|Hard. */
export interface RawAcSubmissionNum {
  difficulty: string;
  /** Distinct problems accepted at this difficulty. */
  count: number;
  /** Total accepted submissions (>= count when a problem is solved twice). */
  submissions: number;
}

/** `matchedUser` root, as returned by the profile+stats query. */
export interface RawMatchedUser {
  username: string;
  githubUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  profile: RawUserProfile;
  submitStatsGlobal: {
    acSubmissionNum: RawAcSubmissionNum[];
  };
}

/** One row of the top-level `allQuestionsCount` query. */
export interface RawAllQuestionsCount {
  difficulty: string;
  count: number;
}

/**
 * `matchedUser.userCalendar`. Note `submissionCalendar` is a JSON **string**
 * (`{"<unixSeconds>": <count>}`) that must be `JSON.parse`d, not an object.
 */
export interface RawUserCalendar {
  activeYears: number[] | null;
  streak: number | null;
  totalActiveDays: number | null;
  submissionCalendar: string | null;
}

/** `userContestRanking`. Entire object is `null` for users who never competed. */
export interface RawUserContestRanking {
  attendedContestsCount: number;
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  topPercentage: number;
}

/** One entry of `userContestRankingHistory` (only `attended:true` entries matter). */
export interface RawUserContestRankingHistoryEntry {
  attended: boolean;
  rating: number;
  ranking: number;
  trendDirection: string | null;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number | null;
  contest: {
    title: string;
    startTime: number; // unix seconds
  };
}

/** One entry of `recentAcSubmissionList`. `timestamp` is a unix-seconds string. */
export interface RawRecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
}

/** One entry within a `tagProblemCounts` bucket. */
export interface RawTagProblemCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

/** `matchedUser.tagProblemCounts`, split by mastery bucket. */
export interface RawTagProblemCounts {
  advanced: RawTagProblemCount[];
  intermediate: RawTagProblemCount[];
  fundamental: RawTagProblemCount[];
}

/* ----------------------- top-level response envelopes ----------------------- */

/** Response for the combined profile + submit-stats query. */
export interface RawProfileResponse {
  matchedUser: RawMatchedUser | null;
  allQuestionsCount: RawAllQuestionsCount[] | null;
}

/** Response for the calendar query. */
export interface RawCalendarResponse {
  matchedUser: { userCalendar: RawUserCalendar | null } | null;
}

/** Response for the contest query. */
export interface RawContestResponse {
  userContestRanking: RawUserContestRanking | null;
  userContestRankingHistory: RawUserContestRankingHistoryEntry[] | null;
}

/** Response for the recent-submissions query. */
export interface RawRecentResponse {
  recentAcSubmissionList: RawRecentSubmission[] | null;
}

/** Response for the topic-tag query. */
export interface RawTopicsResponse {
  matchedUser: { tagProblemCounts: RawTagProblemCounts | null } | null;
}
