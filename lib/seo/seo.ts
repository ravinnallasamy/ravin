import type { Metadata } from 'next';
import defaultSeo from '@/content/seo/default.json';
import homeSeo from '@/content/seo/home.json';
import workSeo from '@/content/seo/work.json';
import workDetailSeo from '@/content/seo/work-detail.json';
import skillsServicesSeo from '@/content/seo/skills-services.json';
import codingSeo from '@/content/seo/coding.json';
import experienceEducationSeo from '@/content/seo/experience-education.json';
import certificationsSeo from '@/content/seo/certifications.json';
import contactSeo from '@/content/seo/contact.json';
import blogSeo from '@/content/seo/blog.json';
import blogDetailSeo from '@/content/seo/blog-detail.json';

/**
 * Central SEO config, sourced from content/seo/*.json.
 * Edit copy / keywords / OG there — never hardcode in components.
 */
export const seo = defaultSeo;
export const baseUrl = defaultSeo.baseUrl;

type OgImage = { url: string; width?: number; height?: number; alt?: string };
type RouteSeo = {
  title?: string;
  description?: string;
  path?: string;
  keywords: { primary: string; secondary: string[] };
  openGraph?: { title?: string; description?: string; images?: OgImage[] };
};

/** Registry of per-route meta files. Static imports so Next can bundle them. */
const ROUTES = {
  home: homeSeo,
  work: workSeo,
  'work-detail': workDetailSeo,
  'skills-services': skillsServicesSeo,
  coding: codingSeo,
  'experience-education': experienceEducationSeo,
  certifications: certificationsSeo,
  contact: contactSeo,
  blog: blogSeo,
  'blog-detail': blogDetailSeo,
} satisfies Record<string, RouteSeo>;

export type RouteKey = keyof typeof ROUTES;

/** Flatten primary + secondary keywords into the array Next expects. */
function flattenKeywords(k: RouteSeo['keywords']): string[] {
  return [k.primary, ...k.secondary];
}

/** Absolute canonical URL for a route path. */
export function canonical(path = '/'): string {
  return new URL(path, seo.baseUrl).toString();
}

/**
 * Builds the root <metadata> export for app/layout.tsx from the JSON config.
 * Page-level metadata should use `metaForRoute()` instead.
 */
export function buildMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: new URL(seo.baseUrl),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: seo.baseUrl },
    openGraph: {
      type: 'website',
      locale: seo.openGraph.locale,
      siteName: seo.openGraph.siteName,
      url: seo.baseUrl,
      title: seo.defaultTitle,
      description: seo.description,
      images: seo.openGraph.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.defaultTitle,
      description: seo.description,
      images: seo.openGraph.images.map((i) => i.url),
    },
    // Icons are provided by the Next app-dir convention:
    // app/icon.png (browser tab + Google) and app/apple-icon.png (iOS).
    // Next auto-injects the <link rel> tags, so no manual `icons` here.
    verification: {
      google: 'luXW8ymReaj0fOcaI1XBF4SOXz0wNAr9-mM2C8B__r4',
    },
    ...overrides,
  };
}

/**
 * Builds a route's Metadata from its content/seo/<route>.json file:
 * merges primary+secondary keywords, canonical URL, and OpenGraph/Twitter.
 * Pass `overrides` for dynamic routes (title/description/images per item).
 */
export function metaForRoute(route: RouteKey, overrides: Metadata = {}): Metadata {
  const r = ROUTES[route] as RouteSeo;
  const title = r.title ?? seo.defaultTitle;
  const description = r.description ?? seo.description;
  const images = r.openGraph?.images ?? seo.openGraph.images;
  const path = r.path;

  return {
    title,
    description,
    keywords: flattenKeywords(r.keywords),
    ...(path ? { alternates: { canonical: canonical(path) } } : {}),
    openGraph: {
      type: 'website',
      siteName: seo.openGraph.siteName,
      ...(path ? { url: canonical(path) } : {}),
      title: r.openGraph?.title ?? title,
      description: r.openGraph?.description ?? description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: r.openGraph?.title ?? title,
      description: r.openGraph?.description ?? description,
      images: images.map((i) => i.url),
    },
    ...overrides,
  };
}

/** Merge a dynamic route's base keywords with per-item extras. */
export function routeKeywords(route: RouteKey, extra: string[] = []): string[] {
  const r = ROUTES[route] as RouteSeo;
  return [...flattenKeywords(r.keywords), ...extra];
}
