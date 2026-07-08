# Security — GitHub Dashboard

How this module's GitHub credentials are protected, end to end, and what to
check before shipping a change that touches it.

## Layers

**1. `.gitignore`** — `.env`, `.env.local`, `.env.development`, `.env.production`,
and `.env.*.local` are all ignored, so no real credentials can be committed.
`.env.example` is the only tracked file, and it only holds placeholder values.

**2. Validated env access (`constants/env.ts`)** — the only module in this
repo that calls `process.env` for GitHub credentials. `getDashboardEnv()`
throws if *no* account is configured at all, but tolerates a half-configured
secondary account (skips it) rather than crashing the whole dashboard over an
optional second identity. Every other file — services, routes, scheduler —
reads credentials through this module, never through `process.env` directly.

**3. No client exposure** — `next.config.js` has no `env:` block, so nothing
is force-inlined into the browser bundle. None of the GitHub vars are
`NEXT_PUBLIC_`-prefixed. Every `"use client"` component in `charts/` and
`components/` receives plain data as props; none of them import
`constants/env.ts`, the `services/` layer, or read `process.env`.

**4. `server-only` build guard** — every file that can reach a credential
(`constants/env.ts`, everything in `services/`, everything in `api/`) starts
with `import 'server-only'`. If any of these are ever imported — even
transitively — into a Client Component, the build fails immediately instead
of silently bundling a token into client JS.

**5. Token rotation reminders (`lib/tokenHealth.ts`)** — reads the optional
`GITHUB_TOKEN_LAST_ROTATED` date and flags tokens as expiring-soon (> 80 days)
or overdue (> 90 days). Purely informational; never blocks a request.

**6. Deployment safety check (`lib/deploymentCheck.ts`)** — at runtime,
verifies the required vars are present and not left as placeholder values
(`your_token_here`, `xxx`, `changeme`, etc.), and records `NODE_ENV`. Exposed
through `GET /api/github-dashboard/health`, which returns full details only
to non-production callers, loopback requests, or callers holding
`GITHUB_DASHBOARD_HEALTH_SECRET`. Any other production caller gets only
`{ status: "ok" | "degraded" }` — never variable names or values.

## Rotating tokens

1. Generate a new PAT on GitHub (Settings → Developer settings → Personal
   access tokens). Match the scopes already in use: `read:user`, `repo` (if
   private repos are included), `read:org`.
2. Update `GITHUB_TOKEN_PRIMARY` (and/or `GITHUB_TOKEN_SECONDARY`) in your
   deployment's env store (Vercel project settings, etc.) — never commit it.
3. Set `GITHUB_TOKEN_LAST_ROTATED` to today's date (`YYYY-MM-DD`).
4. Redeploy, then hit `GET /api/github-dashboard/health` (locally, or with
   `GITHUB_DASHBOARD_HEALTH_SECRET`) to confirm `tokenHealth.daysSinceRotation`
   reset and `deployment.noPlaceholders` is `true`.
5. Revoke the old token on GitHub once the new one is confirmed live.

## Verifying locally

```bash
# 1. Confirm no env file is tracked by git
git status --short | grep -E '^\?\? \.env|^ M \.env'   # should show nothing tracked

# 2. Confirm the client bundle contains no GitHub vars
npm run build
grep -r "GITHUB_TOKEN" .next/static || echo "clean"

# 3. Hit the health route locally (full details, since NODE_ENV != production)
npm run dev
curl -s http://localhost:3000/api/github-dashboard/health | jq
```

A healthy response looks like:

```json
{
  "status": "ok",
  "deployment": { "allVariablesPresent": true, "noPlaceholders": true, "environment": "development", "issues": [] },
  "tokenHealth": { "daysSinceRotation": 12, "isExpiringSoon": false, "isOverdue": false, "message": "..." }
}
```

## Before deploying to production

- [ ] `GITHUB_TOKEN_PRIMARY` / `GITHUB_USERNAME_PRIMARY` are set in the host's
      env store, not in any committed file.
- [ ] Neither token is a placeholder value from `.env.example`.
- [ ] `GITHUB_TOKEN_LAST_ROTATED` is set and recent.
- [ ] `GITHUB_DASHBOARD_REFRESH_SECRET` is set if the external cron refresh
      route is in use (otherwise that route stays disabled — safe default).
- [ ] `GITHUB_DASHBOARD_HEALTH_SECRET` is set if you need full health details
      from outside the deploy's own network; otherwise production callers
      only ever see `{ status }`.
- [ ] `GET /api/github-dashboard/health` from a public client returns only
      `{ status }` — no variable names, no values.
