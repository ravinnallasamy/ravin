# LeetCode Analytics Dashboard

A self-contained module that builds a full analytics dashboard from a single
LeetCode username, rendered at `/leetcode-dashboard`. It talks **only** to
LeetCode's public GraphQL endpoint — no auth, no cookies, no CSRF token —
and every number on the page comes from this module.

## Folder structure

```
leetcode-dashboard/
├── constants/     Static config (endpoint, retry policy, difficulty colours,
│                   cache keys) and validated server-only env access (env.ts)
├── types/          Raw GraphQL wire types, normalised models, ServiceResult
│                   wrapper, and the chart-ready data shapes
├── cache/          Storage-agnostic CacheStore interface + in-memory impl
├── lib/            errors.ts (classification: not-found / rate-limit /
│                   network / malformed)
├── services/       http-client (retry/backoff), GraphQL queries, normalize,
│                   leetcode-service (6 fetch* methods), dashboard-builder,
│                   the LeetcodeDashboardService singleton
├── utils/          Pure helpers: date, math, heatmap grid construction,
│                   streak computation, chart-data transformers
├── api/            Route-handler glue (loadDashboard, forceRefreshDashboard,
│                   getDashboardStatus) + the in-process scheduler
├── hooks/          Server-side data accessors (not React client hooks)
├── charts/         Generic, LeetCode-agnostic chart primitives (Recharts).
│                   Accept plain data props only — no domain logic.
└── components/     Dashboard sections that map LeetcodeDashboard -> UI

app/leetcode-dashboard/page.tsx              The page (Server Component, Suspense-streamed)
app/api/leetcode-dashboard/route.ts          GET  dashboard (cache-first)
app/api/leetcode-dashboard/refresh/route.ts  POST forced refresh (secret-gated)
app/api/leetcode-dashboard/status/route.ts   GET  non-sensitive config/scheduler status
```

## Architecture

```
leetcode.com/graphql (public, no auth)
        │  server-only fetch, retry + backoff
        ▼
services/leetcode-service.ts  ──►  6 independent fetch* methods,
        │                           each returns ServiceResult<T>
        ▼
services/dashboard-builder.ts  (dedupes the shared profile+stats round trip)
        │
        ▼  cached (cache/, keyed by username + query type)
   LeetcodeDashboard  ──►  DashboardResult
        │
        ▼
hooks / api / route handlers  ──►  components/*  (mostly Client Components —
                                        charts need the DOM; sections that are
                                        pure presentation stay server-rendered)
                                        │
                                        ▼
                                   charts/* (generic Recharts wrappers)
```

- **The data layer never throws to the UI.** Every service method resolves to
  `ServiceResult<T> = { data, error, unavailable }`. `unavailable: true` means
  "this datapoint is public but empty for this user" (e.g. someone who has
  never entered a contest) — it is not an error and is never rendered as one.
- **Sections hide or degrade, never fake.** Contest Analytics, Recent
  Activity, and Topic Distribution return `null` and render nothing when
  their data is unavailable, per the original spec. The Submission Heatmap
  instead shows an explicit "not publicly available" state, since a missing
  calendar is more likely a transient/parse failure than "this user has zero
  submissions ever."
- **Personal Insights only derives from data already fetched.** Nothing is
  estimated — difficulty preference, distribution balance, and consistency
  are computed directly from `ProblemStats` / `SubmissionCalendar`, and each
  insight card only appears if its source data exists.

## Public API research (Phase 1 findings)

Endpoint: `https://leetcode.com/graphql`. No auth header, cookie, or CSRF
token required for any of the queries this module uses.

| Data | Public? | Query field | Notes |
|---|---|---|---|
| Profile (avatar, name, ranking, reputation, country, socials) | Yes | `matchedUser.profile` | Some fields (`realName`, `countryName`) are `null` if the user hides them — rendered conditionally, never faked |
| Problem stats (solved/available per difficulty) | Yes | `matchedUser.submitStatsGlobal.acSubmissionNum` + `allQuestionsCount` | Includes an `"All"` aggregate row alongside Easy/Medium/Hard |
| Submission calendar (heatmap source) | Yes | `matchedUser.userCalendar` | `submissionCalendar` is a **JSON string**, not an object — must be `JSON.parse`d |
| Contest rating / ranking / history | Yes (query is public); **empty for non-competitors** | `userContestRanking`, `userContestRankingHistory` | Verified against a real competitor (`lee215`) to confirm the query itself works — `ravinit001` correctly returns `unavailable: true` |
| Recent accepted submissions | Yes | `recentAcSubmissionList` | Returns id/title/titleSlug/timestamp only — **no difficulty field**, so the Recent Activity list does not show a difficulty badge (would require fabricating data) |
| Topic tag stats | Yes | `matchedUser.tagProblemCounts` | Grouped into fundamental/intermediate/advanced buckets |

A non-existent username returns **HTTP 200** with `{ errors: [...], data: {
matchedUser: null } }` — never a non-200 status — so error classification
(`lib/errors.ts`) inspects the GraphQL `errors` array and null-ness of
`matchedUser`, not the HTTP status code.

## Caching & refresh strategy

- **Cache-aside**, keyed by `username + query type` (`constants/CACHE_KEYS`),
  TTL = `LEETCODE_REFRESH_INTERVAL` seconds (default 21600 = 6h, clamped to
  `[300, 604800]`).
- **Storage is swappable.** `CacheStore` (`cache/types.ts`) is a small async
  interface; `MemoryCacheStore` is the only implementation today. Swapping in
  Redis means writing one class and changing the singleton in
  `cache/index.ts` — nothing else in the module changes.
- **Scheduled refresh, not per-request fetching.** `api/scheduler.ts` starts
  an unref'd `setInterval` the first time any request touches the module, so
  a persistent Node host refreshes in the background on the configured
  cadence. On serverless hosts, point an external cron at
  `POST /api/leetcode-dashboard/refresh` instead.
- `GET /api/leetcode-dashboard` also carries ISR (`revalidate = 21_600`) as a
  second, complementary cache layer at the Next.js route-segment level; the
  actual cadence is enforced by the in-module cache TTL underneath it.

## Required environment variables

All are **server-only** — never prefixed `NEXT_PUBLIC_`, never sent to the
client.

| Variable | Required | Notes |
|---|---|---|
| `LEETCODE_USERNAME` | No | Falls back to the handle parsed from `content/social.json`'s `leetcodeUsername` URL if unset |
| `LEETCODE_REFRESH_INTERVAL` | No | Seconds, default `21600` (6h), clamped to `[300, 604800]` |
| `LEETCODE_DASHBOARD_REFRESH_SECRET` | No | Bearer secret for `POST /refresh`; endpoint returns 403 if unset |

If no username can be resolved from either source, `isLeetcodeConfigured()`
returns `false` and `/leetcode-dashboard` renders an "unconfigured" state
instead of attempting to fetch.

## Deploy steps

1. Set the env vars above in your hosting provider, never committing real
   values to `.env` — only `.env.example` is checked in with values omitted.
2. `npm run build && npm run start` (or your platform's Next.js build step).
3. **Persistent Node host**: the in-process scheduler is sufficient.
4. **Serverless host** (e.g. Vercel): also configure an external cron to
   `POST /api/leetcode-dashboard/refresh` with
   `Authorization: Bearer $LEETCODE_DASHBOARD_REFRESH_SECRET` on the same
   cadence as `LEETCODE_REFRESH_INTERVAL`. Reads still work without this —
   the cache-aside path rebuilds on demand — but the cron keeps the cache
   warm so users never pay the fetch latency.

## UI states, accessibility & performance

- **Loading**: `app/leetcode-dashboard/page.tsx` wraps the data-dependent
  tree in `<Suspense fallback={<DashboardSkeleton />}>`; skeletons match the
  shape of the real content (stat grid, chart blocks, card lines).
- **Error**: total failure (bad/unresolvable username) renders
  `DashboardErrorState` with a "Retry" button (`router.refresh()`).
- **Unconfigured**: no username resolvable anywhere renders
  `DashboardUnconfiguredState` without attempting a fetch.
- **Unavailable**: the Submission Heatmap shows `NotPubliclyAvailableState`;
  Contest Analytics, Recent Activity, and Topic Distribution simply don't
  render (return `null`) rather than showing an empty card, per spec.
- **Accessibility**: charts carry `role="img"` + `aria-label`; the heatmap's
  range toggle is a proper `role="tablist"`; every interactive control
  (range toggle, heatmap cells) is keyboard-reachable with visible focus
  rings (`focus-visible:ring-2`); the heatmap legend and hover tooltip are
  supplementary to per-cell `aria-label`s, not a replacement.
- **Performance**: `charts/*` and every chart-bearing section are loaded via
  `next/dynamic` with `ssr: false` and a `SkeletonChart` fallback, so Recharts
  never ships in the initial server-rendered payload; derived calculations
  (heatmap grid, streaks, insights) are plain functions computed once per
  render from already-fetched data, not re-fetched or re-derived on
  interaction.

## Chart library note

The original brief called for Apache ECharts. The sibling `github-dashboard/`
module (this module's architectural precedent) already ships a full
`charts/` layer built on **Recharts**, which is already a project
dependency — ECharts is not. To keep both dashboards visually and
architecturally consistent (and avoid a second charting library in the
bundle), `leetcode-dashboard/charts/` mirrors `github-dashboard/charts/`
one-for-one on Recharts instead.

## Extending with authentication later

Every query this module uses is public. If you later want session-gated data
(e.g. private submission notes, full submission list beyond the public
`recentAcSubmissionList` cap), the seam is `services/http-client.ts`: add an
authenticated variant that attaches LeetCode's session cookie + CSRF token
(sent server-side only, never exposed to the client), and route the specific
`fetch*` methods that need it through it instead of the public client. The
`ServiceResult<T>` contract and cache layer need no changes — an
authenticated fetch is still just a function that returns `ServiceResult<T>`.

## Adding to a unified multi-platform dashboard later

This module is intentionally isolated the same way `github-dashboard/` is:
no imports of one from the other, both exposing the same shape of contract
(`ServiceResult<T>`, a `*Dashboard` root type with per-section results, a
`DashboardMeta`). To merge LeetCode, GitHub, Codeforces, HackerRank, etc.
into one unified view:

1. Add a new sibling module per platform, following this same
   `constants/types/cache/services/utils/api/hooks/charts/components`
   layout.
2. Write a `lib/combine.ts`-style function (see `github-dashboard/lib/combine.ts`
   for the pattern) that takes each platform's `*Dashboard` and produces a
   `UnifiedDeveloperDashboard` — this module's `LeetcodeDashboard` type
   (`types/result.ts`) is already a plain, mergeable shape.
3. Build a new top-level page/section set that composes each platform's
   existing `components/*` sections under one shell, rather than rewriting
   them — every section here already accepts plain normalised data as props,
   not raw LeetCode types, so they compose without modification.

## Known gaps carried from Phase 1's data contract

- **Recent submissions have no difficulty field.** LeetCode's public
  `recentAcSubmissionList` query doesn't return it, so the Recent Activity
  list omits a difficulty badge rather than fabricating one.
- **Contest data is query-verified-public but naturally empty for
  non-competitors.** This is not a gap in the integration — it's the correct
  behaviour, confirmed by testing the same query against a user with contest
  history.
