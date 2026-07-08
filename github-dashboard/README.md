# Unified GitHub Developer Dashboard

A self-contained module that merges two GitHub accounts into a single
developer identity and renders it at `/dashboard`. Nothing outside
`github-dashboard/` talks to GitHub — every number on the page is produced by
this module.

## Folder structure

```
github-dashboard/
├── constants/     Static config (endpoints, retry policy, refresh intervals)
│                   and validated server-only env access (constants/env.ts)
├── types/          Raw GitHub entity types + the merged UI contract
├── cache/          Storage-agnostic CacheStore interface + in-memory impl
├── utils/          Pure helpers: dates, math, contribution/streak/peak calc,
│                   aggregation (daily/weekly/monthly/yearly), sorting,
│                   heatmap grid, generic chart-series transforms
├── lib/            merge.ts (the 7 merge functions), combine.ts (assembles
│                   MergedDashboard), errors.ts
├── services/       http-client (auth/retry/backoff/pagination), normalize,
│                   GraphQL queries, account-fetcher, github-service
│                   (the ONLY class the rest of the app calls)
├── api/            Route-handler glue (loadDashboard, forceRefreshDashboard,
│                   getDashboardStatus) + the in-process scheduler
├── hooks/          Server-side data accessors (not React client hooks)
├── charts/         Generic, GitHub-agnostic chart primitives (Recharts).
│                   Accept plain data props only — no domain logic.
└── components/     Dashboard sections that map MergedDashboard -> UI

app/dashboard/page.tsx              The page (Server Component, Suspense-streamed)
app/api/github-dashboard/route.ts           GET  merged dashboard (cache-first)
app/api/github-dashboard/refresh/route.ts   POST forced refresh (secret-gated)
app/api/github-dashboard/status/route.ts    GET  non-sensitive config/scheduler status
```

## Architecture

```
GitHub REST + GraphQL
        │  (bearer token per account, server-only)
        ▼
services/account-fetcher.ts  ──►  AccountData (per account, normalised)
        │
        ▼  Promise.allSettled — one account failing never blocks the other
services/github-service.ts
        │
        ▼  lib/combine.ts  (wires lib/merge.ts + utils/*)
     MergedDashboard  ──►  cached (cache/) ──►  DashboardResult
        │
        ▼
hooks / api / route handlers  ──►  components/*  (Server Components)
                                        │
                                        ▼
                                   charts/* (generic Recharts wrappers)
```

- **Server Components by default.** Only components that need interaction
  (`RepositoryTable` sort dropdown, `CommitAnalyticsSection` granularity tabs,
  every `charts/*` wrapper since Recharts needs the DOM) are `'use client'`.
- **The data layer never throws to the UI.** `GitHubService.getDashboard()`
  always resolves to a `DashboardResult`:
  `{ ok: true, data, stale }` or `{ ok: false, error, data: null }`.
  `app/dashboard/page.tsx` branches on `result.ok` and renders
  `DashboardErrorState` on total failure — no uncaught exceptions reach React.
- **Partial data is a first-class state.** If one account fails but the other
  succeeds, `result.ok` is still `true`; the failure rides in
  `data.meta.errors` / `data.meta.partial` and surfaces as a
  `PartialDataBanner` above the rest of the page, not a hard failure.

## API flow

| Route | Method | Purpose |
|---|---|---|
| `/api/github-dashboard` | GET | Cache-first merged dashboard. 503 if unconfigured, 502 on total failure, 200 otherwise (partial data flagged in the body). Sends `Cache-Control` matching the refresh interval. |
| `/api/github-dashboard/refresh` | POST | Forces a rebuild and overwrites the cache. Requires `Authorization: Bearer <GITHUB_DASHBOARD_REFRESH_SECRET>`. Meant to be hit by an external cron (Vercel Cron, GitHub Actions) in serverless deploys. Disabled (403) if the secret is unset. |
| `/api/github-dashboard/status` | GET | Non-sensitive snapshot: which accounts are configured, refresh cadence, scheduler state. No tokens or usernames beyond account keys. |

The `/dashboard` page itself does **not** call these HTTP routes — it calls
`loadDashboard()` directly (same process, no network hop). The routes exist
for external consumers (cron, monitoring, a future separate frontend).

## Caching & merge strategy

- **Cache-aside with stale-if-error.** `cache/index.ts`'s `readThrough()`
  serves a fresh cache hit immediately; on a miss/expiry it rebuilds and
  caches the result; if the rebuild throws and a stale entry still exists, it
  serves the stale entry rather than failing the request.
- **TTL = `GITHUB_REFRESH_INTERVAL`**, translated to seconds via
  `REFRESH_INTERVALS` in `constants/index.ts`. The same value drives the
  cache TTL, the route's `Cache-Control` header, and the scheduler interval.
- **Storage is swappable.** `CacheStore` (`cache/types.ts`) is a 4-method
  async interface (`get/set/delete/clear`). `MemoryCacheStore` is the only
  implementation today; swapping in Redis means writing one class and
  changing the singleton in `cache/index.ts` — nothing else in the module
  changes.
- **Scheduled refresh, not per-request fetching.** `api/scheduler.ts` starts
  an unref'd `setInterval` the first time any request touches the module
  (`ensureScheduler()` in `api/index.ts`), so a persistent Node host
  refreshes in the background on the configured cadence. On serverless hosts
  (no long-lived process), point an external cron at
  `POST /api/github-dashboard/refresh` instead — both paths call the same
  `GitHubService.refreshDashboard()`.
- **Merge rules** (`lib/merge.ts`), all pure functions:
  - `mergeContributions` — **sums counts per calendar day** across accounts
    (account A = 6, account B = 4 on the same date → merged = 10), then
    rebuilds the week grid and recomputes intensity levels against the new
    combined max.
  - `mergeRepositories` — de-duped by `fullName` (defensive; repos are
    normally disjoint per account).
  - `mergeLanguages` — sums bytes-per-language across every repo, then
    re-derives percentages.
  - `mergeFollowers` — de-duped by `login`, so someone following both
    accounts counts once (true combined reach, not a naive sum).
  - `mergeOrganizations` — de-duped by org id.
  - `mergeEvents` — concatenated and re-sorted newest-first.
  - `mergeStatistics` — sums totals over the already-merged/de-duped sets;
    `memberSince` is the earliest account-creation date.

## Adding a third account

The current env schema (`constants/env.ts`) hard-codes two slots
(`primary`/`secondary`) because that's what was asked for. To add a third:

1. In `constants/index.ts`, extend `ACCOUNT_KEYS` (e.g.
   `['primary', 'secondary', 'tertiary']`) and the `AccountKey` type.
2. In `constants/env.ts`, add a `GITHUB_USERNAME_TERTIARY` /
   `GITHUB_TOKEN_TERTIARY` pair to `getDashboardEnv()`, following the same
   "include only if both username and token are present" pattern used for
   `secondary`.
3. Add the two vars to `.env` / `.env.example`.

Nothing in `services/`, `lib/merge.ts`, or `components/` needs to change —
every merge function and fetch already operates over `env.accounts` as an
array, not fixed positional fields.

## Changing the refresh interval

Set `GITHUB_REFRESH_INTERVAL` in `.env` to one of `hourly | 6h | 12h | daily`
(see `REFRESH_INTERVALS` in `constants/index.ts`). Unrecognised or blank
values fall back to `6h` (`DEFAULT_REFRESH_INTERVAL`). This single value
controls the cache TTL, the `/api/github-dashboard` `Cache-Control` header,
and the in-process scheduler's interval — restart the server (or redeploy)
for a changed value to take effect, since it's read once per process via the
memoised `getDashboardEnv()`.

## Required environment variables

All are **server-only** — never prefixed `NEXT_PUBLIC_`, never sent to the
client, only read inside `github-dashboard/` and route handlers.

| Variable | Required | Notes |
|---|---|---|
| `GITHUB_USERNAME_PRIMARY` | Yes | Primary account's GitHub username |
| `GITHUB_TOKEN_PRIMARY` | Yes | PAT with `read:user`, `repo`, `read:org` scopes |
| `GITHUB_USERNAME_SECONDARY` | No | Only included if paired with a token |
| `GITHUB_TOKEN_SECONDARY` | No | Only included if paired with a username |
| `GITHUB_REFRESH_INTERVAL` | No | `hourly \| 6h \| 12h \| daily`, defaults to `6h` |
| `GITHUB_DASHBOARD_REFRESH_SECRET` | No | Bearer secret for `POST /refresh`; endpoint returns 403 if unset |

At least one account (username + token pair) must be configured or
`isDashboardConfigured()` returns `false` and `/dashboard` renders an
"unconfigured" state instead of attempting to fetch.

## Deploy steps

1. Set the env vars above in your hosting provider (Vercel/Netlify/etc.),
   never committing real values to `.env` — only `.env.example` is checked in
   with real values omitted.
2. `npm run build && npm run start` (or your platform's Next.js build step).
3. **Persistent Node host** (e.g. a VPS, container running `next start`): the
   in-process scheduler is sufficient — no extra setup needed.
4. **Serverless host** (e.g. Vercel): the in-process `setInterval` does not
   survive between invocations, so also configure an external cron (Vercel
   Cron, GitHub Actions scheduled workflow, etc.) to
   `POST /api/github-dashboard/refresh` with
   `Authorization: Bearer $GITHUB_DASHBOARD_REFRESH_SECRET` on the same
   cadence as `GITHUB_REFRESH_INTERVAL`. Reads still work without this (the
   cache-aside read path rebuilds on demand), but the cron keeps the cache
   warm so users never pay the fetch latency.

## UI states, accessibility & performance

- **Loading**: `app/dashboard/page.tsx` wraps the data-dependent tree in
  `<Suspense fallback={<DashboardSkeleton />}>` so the shell (nav, layout)
  paints immediately while GitHub data streams in.
- **Empty**: every section (`EmptySectionState`) renders a neutral message
  instead of an empty table/chart when a list is empty (e.g. no orgs).
- **Error**: total failure renders `DashboardErrorState` with a "Retry"
  button (`router.refresh()`); partial failure renders the rest of the page
  plus a `PartialDataBanner`; unconfigured renders `DashboardUnconfiguredState`.
- **Accessibility**: charts carry `role="img"` + `aria-label` describing the
  data; the repo table has a `<caption>` and scoped `<th>`s; interactive
  controls (sort select, granularity tabs, heatmap cells) are keyboard-
  reachable with visible focus rings (`focus-visible:ring-2`); the heatmap
  legend and tooltips are supplementary to (not a replacement for) per-cell
  `aria-label`s.
- **Performance**: chart components are `'use client'` islands so the rest of
  each section stays server-rendered; expensive derivations (`sortRepositories`,
  bucketed series, trend calculation) are wrapped in `useMemo` where they
  re-run on user interaction (sort key, granularity tab); the dashboard is
  fetched once per cache TTL, never per page load.

## Known gaps carried from Phase 1's data contract

The UI renders only what `MergedDashboard` models. Two things requested in
the UI brief aren't in that contract and were **not fabricated**:

- **Repository license & default branch** — `Repository` has no `license` or
  `defaultBranch` field, so the repo table omits those columns rather than
  showing fake data. Add the fields to `types/github.ts`,
  `services/normalize.ts`, and the REST fetch in `services/account-fetcher.ts`
  if you want them.
- **Organization members/role** — `Organization` has no `members` or `role`
  field (the REST `/user/orgs` endpoint doesn't return membership role
  without an extra per-org call). The Organizations section shows logo,
  login, and description only.
