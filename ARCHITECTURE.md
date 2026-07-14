# Architecture

A map of how this repo is organized and **where new code should go**. Read the
"Where does X go?" table first — it answers most questions in one line.

This is a Next.js 15 App Router portfolio/blog. Content is data-driven (JSON +
MDX), rendered by server components with a few client islands. See `CLAUDE.md`
for commands and the data-getter contract.

---

## Where does X go? (decision tree)

| I'm adding… | Put it in… | Notes |
|---|---|---|
| A new **page / route** | `app/<route>/page.tsx` | Keep it thin — compose section components, read data via `lib/`. No business logic here. |
| **Copy, projects, skills, certs, digest** (any site content) | `content/*.json` | Never hardcode copy in components. Add a typed getter in `lib/content/`. |
| A **blog post** | `content/blog/*.json` | Read via `lib/content/blog.ts`. |
| A **section** used by exactly one route | `components/<route>/` | Folder name **must** match the route segment (e.g. `/work` → `components/work/`). |
| A **primitive shared across many routes** | `components/ui/` | NavBar, Footer, Reveal, MediaSlot, buttons, headings — genuinely cross-feature only. |
| A **content getter** (reads JSON/MDX) | `lib/content/` | `content.ts`, `blog.ts`. Callers import getters, not raw JSON. |
| A **server-only action** (email, LLM, secrets) | `lib/server/` | `email.ts`, `resumeChat.ts`. Touches env/secrets; never imported by client components. |
| A **pure utility** (no I/O) | `lib/utils/` | `seo.ts`, `hash.ts`. |
| Anything for the **GitHub or LeetCode dashboards** | `github-dashboard/` or `leetcode-dashboard/` | Self-contained feature modules — see below. |
| A **chart card / skeleton / tooltip** shared by both dashboards | `components/dashboard/` | Single source of truth; the modules re-export from here. |

---

## Top-level layout

```
app/                  Routes only. Each page.tsx composes sections + reads lib/.
  api/                Thin API route handlers (delegate to feature modules / lib).
components/
  <route>/            Sections for one route. Folder name == route segment.
  ui/                 Shared primitives used across many routes.
  dashboard/          Shared dashboard primitives (DashboardCard, RadialProgress,
                      Skeleton, ChartTooltip) — single source of truth for both
                      dashboard modules, which re-export from here.
content/              All site data: *.json + blog/*.json. The source of truth.
lib/
  content/            Data access: content.ts, blog.ts (the typed getters).
  server/             Server-only actions: email.ts, resumeChat.ts (secrets/env).
  utils/              Pure helpers: seo.ts (JSON-LD), hash.ts.
github-dashboard/     Self-contained GitHub-stats feature module (see below).
leetcode-dashboard/   Self-contained LeetCode-stats feature module (see below).
public/               Static assets (images, resume, llms.txt).
```

The `@/*` path alias maps to the repo root, so imports look like
`@/lib/content/content`, `@/components/ui/NavBar`, `@/github-dashboard`.

---

## The `coding` feature — one name, everywhere

The GitHub + LeetCode stats page uses **"coding"** as its single canonical name.
When you touch it, keep all of these in sync:

- Route: `app/coding/`
- Sections: `components/coding/`
- Nav label / page title / hero eyebrow: **"Coding"**
- Data modules: `github-dashboard/`, `leetcode-dashboard/`

Don't reintroduce alternate labels ("Git & Solves", "Dashboards") — a single
searchable name is the point.

---

## Dashboard feature modules

`github-dashboard/` and `leetcode-dashboard/` are **self-contained modules**.
Import the common surface from the module root (`@/github-dashboard`); deep-import
sub-paths only when you need internals. Each has a documented `index.ts` barrel.

Internal layering (data flows **down**; never import upward):

```
components/  ← React sections (consume hooks + charts)
hooks/       ← client data-loading hooks
api/         ← cache-first load / refresh / status entry points
services/    ← external API calls (GitHub GraphQL / LeetCode), normalization
cache/       ← in-memory cache-through store
lib/         ← module-local orchestration (merge, combine, errors)
utils/       ← pure helpers (date, math, sort, heatmap…)
types/       ← shared type definitions
constants/   ← env config + refresh intervals
charts/      ← generic Recharts primitives (plain data props only)
```

Rules:
- `services/` is the **only** layer that talks to the network.
- Everything degrades to `null` / an error result on failure — callers must
  handle the not-configured and error cases (see `constants/env.ts`).
- Shared UI (`DashboardCard`, `RadialProgress`, `Skeleton`, `ChartTooltip`)
  lives in `@/components/dashboard`; the modules' `charts/` and `components/`
  re-export it rather than duplicating.

---

## Conventions

- **Server components by default.** Add `'use client'` only for interactivity or
  browser APIs (see `components/ui/Reveal.tsx`, `components/contact/Form.tsx`).
- **No functions passed server→client.** Use serializable props (see how
  `ChartTooltip` takes a `valueFormat` string, not a formatter callback).
- **Design tokens only.** Use the Tailwind theme tokens defined in
  `tailwind.config.js` (`text-ink-muted`, `bg-surface-raised`, `text-h2-lg`,
  `gap-24`…), not arbitrary values.
- **External data degrades to null.** ISR fetches (`revalidate: 3600`) return
  `null`/error on failure; render an empty/error state, never assume presence.
