# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build (also runs type checking)
- `npm run start` — serve the production build
- `npm run lint` — run `next lint` (ESLint, `next/core-web-vitals` config)

There is no test suite configured in this repo.

## Architecture

This is a Next.js 15 App Router personal portfolio/blog site (static content + a few client islands), styled with Tailwind.

### Content is data-driven, not hardcoded

Nearly all page content lives in `content/*.json` (site info, social links, skills, projects, certifications, tech digest) and `content/blog/*.mdx` (blog posts with gray-matter frontmatter). `lib/content.ts` and `lib/blog.ts` are the only modules that read these files and expose typed getters (`getSite`, `getSocial`, `getSkills`, `getProjects`, `getProjectBySlug`, `getCertifications`, `getAllPosts`, `getPostBySlug`, `getTechDigest`). Pages and components should pull data through these getters rather than importing the JSON/MDX directly. When adding or editing site copy, projects, skills, or certifications, edit the JSON files — don't hardcode values in components.

`content/projects.json` entries are sorted by `priority` on read. Project detail routes are statically generated via `generateStaticParams` in `app/work/[slug]/page.tsx` (mirrored by `app/blog/[slug]/page.tsx` for posts).

### External data fetching (optional, degrade to null)

`lib/github.ts` and `lib/leetcode.ts` fetch live stats (GitHub GraphQL API, LeetCode stats API) using the username embedded in `content/social.json`. Both are `revalidate: 3600` ISR fetches and return `null` on any failure or missing token (`GITHUB_TOKEN` for GitHub) — callers must handle the `null` case rather than assuming stats are present.

### Structure

- `app/` — route segments (App Router). Each route's `page.tsx` composes section components and reads content via `lib/`.
- `components/sections/` — page-specific composed sections (Hero, WorkPreview, ContactPanel, etc.), generally server components except where interactivity is needed.
- `components/ui/` — reusable primitives (NavBar, Footer, MediaSlot, Reveal animation wrappers, StatusPill, etc.).
- `lib/` — data access (`content.ts`, `blog.ts`) and integrations (`github.ts`, `leetcode.ts`, `seo.ts`, `hash.ts`).

### Client components

The codebase defaults to server components. `'use client'` is reserved for components needing interactivity or browser APIs — e.g. `components/ui/Reveal.tsx` (Framer Motion scroll-reveal, respects `useReducedMotion`) and `components/sections/ContactForm.tsx` (builds a `mailto:` link client-side; no backend form handler).

### SEO

`lib/seo.ts` builds JSON-LD (`personJsonLd`, `projectJsonLd`) injected via inline `<script type="application/ld+json">` tags in pages. `app/sitemap.ts` and `app/robots.ts` generate the sitemap/robots files from the same content sources. `public/llms.txt` is a hand-maintained LLM-readable summary of the site.

### Styling

Tailwind config (`tailwind.config.js`) defines the full design system as theme extensions: a warm paper/ink color palette, `display` (Poppins)/`body` (IBM Plex Sans)/`mono` (IBM Plex Mono) font families wired to CSS variables set in `app/layout.tsx`, custom type scale (`h1`, `h1-lg`, `h2`, etc.), and a fixed numeric spacing scale (`4`–`128`, in px-equivalents). Use these design tokens (e.g. `text-ink-muted`, `bg-surface-raised`, `text-h2-lg`, `gap-32`) instead of arbitrary Tailwind values to stay consistent with the existing UI.

### Path alias

`@/*` maps to the repo root (see `tsconfig.json`), used throughout for imports like `@/lib/content`, `@/content/site.json`, `@/components/ui/...`.
