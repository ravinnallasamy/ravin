import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';
import websiteBase from '@/content/jsonld/_shared/website.json';
import personBase from '@/content/jsonld/_shared/person.json';
import professionalServiceBase from '@/content/jsonld/_shared/professional-service.json';
import faqBase from '@/content/jsonld/_shared/faq.json';
import servicesJson from '@/content/services.json';
import { baseUrl, canonical } from '@/lib/seo/seo';
import type { Project } from '@/lib/content/content';

type JsonLd = Record<string, unknown>;

/**
 * JSON-LD graph builders. Static shape lives in content/jsonld/*.json;
 * dynamic identity fields and list schemas are merged from
 * site.json / social.json / services.json so there's a single source of truth.
 */

export function websiteJsonLd(): JsonLd {
  return { ...websiteBase };
}

export function personJsonLd(): JsonLd {
  return {
    ...personBase,
    name: siteJson.name,
    // jobTitle, description, knowsAbout, etc. come from personBase (the static
    // file) — the freelance-positioned values. Only identity fields that must
    // stay in sync with content/*.json are merged here.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    sameAs: [socialJson.github, `https://${socialJson.linkedin}`],
    email: `mailto:${socialJson.email}`,
  };
}

/** ProfessionalService — the core "available for hire" schema for freelancers. */
export function professionalServiceJsonLd(): JsonLd {
  return {
    ...professionalServiceBase,
    sameAs: [socialJson.github, `https://${socialJson.linkedin}`],
    hasOfferCatalog: { '@id': `${canonical('/skills-services')}#catalog` },
  };
}

/** FAQPage — the primary AEO/GEO asset; answer engines quote these directly. */
export function faqJsonLd(): JsonLd {
  return { ...faqBase };
}

/** OfferCatalog built from content/services.json — one Offer per service. */
export function servicesJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${canonical('/skills-services')}#catalog`,
    name: 'Freelance Services — Ravin Nallasamy',
    url: canonical('/skills-services'),
    numberOfItems: servicesJson.length,
    itemListElement: servicesJson.map((s) => ({
      '@type': 'Offer',
      category: s.title,
      itemOffered: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        serviceType: s.title,
        provider: { '@id': `${baseUrl}/#service` },
        areaServed: { '@type': 'Place', name: 'Worldwide' },
      },
    })),
  };
}

/** BreadcrumbList for any route. Pass ordered [{name, path}] crumbs. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonical(c.path),
    })),
  };
}

/** ItemList of projects for the /work collection page. */
export function projectListJsonLd(projects: Project[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects — Ravin Nallasamy',
    description:
      'Freelance full-stack and AI projects designed, built, and shipped by Ravin Nallasamy.',
    url: canonical('/work'),
    numberOfItems: projects.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.tagline,
        url: canonical(`/work/${p.slug}`),
        ...(p.cover ? { image: new URL(p.cover, baseUrl).toString() } : {}),
      },
    })),
  };
}

/**
 * A portfolio project modelled as a CreativeWork (the deliverable), with the
 * source repo linked as a nested SoftwareSourceCode workExample. This frames
 * each entry as Ravin's work rather than raw source code.
 */
export function projectJsonLd(project: Project): JsonLd {
  const detailUrl = canonical(`/work/${project.slug}`);
  const repo = project.repos[0]?.url;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${detailUrl}#project`,
    name: project.title,
    headline: project.tagline,
    description: project.summary,
    url: detailUrl,
    image: project.cover ? new URL(project.cover, baseUrl).toString() : undefined,
    keywords: project.stack,
    dateCreated: project.year,
    inLanguage: 'en-US',
    author: { '@id': `${baseUrl}/#person` },
    creator: { '@id': `${baseUrl}/#person` },
    isPartOf: { '@id': `${baseUrl}/#website` },
    ...(project.demo ? { sameAs: project.demo } : {}),
    ...(repo
      ? {
          workExample: {
            '@type': 'SoftwareSourceCode',
            name: `${project.title} — source`,
            codeRepository: repo,
            programmingLanguage: project.stack,
          },
        }
      : {}),
  };
}

/** ItemList of certifications (EducationalOccupationalCredential) for /certifications. */
export function certificationsJsonLd(
  certs: { title: string; issuer: string; year: string; credentialUrl?: string }[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Certifications — Ravin Nallasamy',
    url: canonical('/certifications'),
    numberOfItems: certs.length,
    itemListElement: certs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'EducationalOccupationalCredential',
        name: c.title,
        credentialCategory: 'certificate',
        recognizedBy: { '@type': 'Organization', name: c.issuer },
        about: { '@id': `${baseUrl}/#person` },
        ...(c.credentialUrl ? { url: c.credentialUrl } : {}),
        datePublished: c.year,
        validFrom: c.year,
      },
    })),
  };
}

/** Absolute URL of the default OG/share image, reused across schemas. */
const OG_IMAGE = new URL('/images/og/default.jpg', baseUrl).toString();

/** Blog collection schema for /blog. Pass minimal post refs. */
export function blogJsonLd(
  posts: { slug: string; title: string; summary?: string; date?: string }[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${canonical('/blog')}#blog`,
    name: 'Blog — Ravin Nallasamy',
    description:
      'Writing on full-stack and AI engineering — RAG, agents, prompt engineering, and AEO/GEO.',
    url: canonical('/blog'),
    inLanguage: 'en-US',
    author: { '@id': `${baseUrl}/#person` },
    publisher: { '@id': `${baseUrl}/#person` },
    isPartOf: { '@id': `${baseUrl}/#website` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.summary,
      url: canonical(`/blog/${p.slug}`),
      mainEntityOfPage: canonical(`/blog/${p.slug}`),
      ...(p.date ? { datePublished: p.date, dateModified: p.date } : {}),
      author: { '@id': `${baseUrl}/#person` },
    })),
  };
}

/** Single BlogPosting for a blog detail page. */
export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  summary?: string;
  date?: string;
}): JsonLd {
  const url = canonical(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    description: post.summary,
    url,
    image: OG_IMAGE,
    inLanguage: 'en-US',
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    author: { '@id': `${baseUrl}/#person` },
    publisher: { '@id': `${baseUrl}/#person` },
    isPartOf: { '@id': `${canonical('/blog')}#blog` },
    mainEntityOfPage: url,
  };
}

/** The site-wide graph rendered in the root layout head (every page). */
export function rootJsonLd(): JsonLd[] {
  return [websiteJsonLd(), personJsonLd()];
}

/* ────────────────────────────────────────────────────────────────────────
 * Per-route resolver
 *
 * Each route declares its graph in content/jsonld/<route>/graph.json via an
 * `include` list of tokens. jsonLdForRoute() reads that file and assembles
 * the graph, wiring dynamic context (projects, posts, certs, per-item data)
 * where a token needs it. This is the single place pages call.
 * ──────────────────────────────────────────────────────────────────────── */

import homeGraph from '@/content/jsonld/home/graph.json';
import contactGraph from '@/content/jsonld/contact/graph.json';
import skillsServicesGraph from '@/content/jsonld/skills-services/graph.json';
import workGraph from '@/content/jsonld/work/graph.json';
import blogGraph from '@/content/jsonld/blog/graph.json';
import certificationsGraph from '@/content/jsonld/certifications/graph.json';
import codingGraph from '@/content/jsonld/coding/graph.json';
import experienceEducationGraph from '@/content/jsonld/experience-education/graph.json';
import workDetailGraph from '@/content/jsonld/work-detail/graph.json';
import blogDetailGraph from '@/content/jsonld/blog-detail/graph.json';

type Crumb = { name: string; path: string };
type Graph = {
  include: string[];
  breadcrumb?: Crumb[];
  breadcrumbBase?: Crumb[];
};

const GRAPHS = {
  home: homeGraph,
  contact: contactGraph,
  'skills-services': skillsServicesGraph,
  work: workGraph,
  blog: blogGraph,
  certifications: certificationsGraph,
  coding: codingGraph,
  'experience-education': experienceEducationGraph,
  'work-detail': workDetailGraph,
  'blog-detail': blogDetailGraph,
} satisfies Record<string, Graph>;

export type JsonLdRoute = keyof typeof GRAPHS;

/** Context a dynamic route passes in so list/detail tokens can be built. */
export type JsonLdContext = {
  projects?: Project[];
  posts?: { slug: string; title: string; summary?: string; date?: string }[];
  certifications?: { title: string; issuer: string; year: string; credentialUrl?: string }[];
  project?: Project;
  post?: { slug: string; title: string; summary?: string; date?: string };
};

/**
 * Assembles the JSON-LD array for a route from its content/jsonld/<route>/graph.json.
 * Pass ctx for routes whose graph.json includes list/detail tokens.
 */
export function jsonLdForRoute(route: JsonLdRoute, ctx: JsonLdContext = {}): JsonLd[] {
  const graph = GRAPHS[route] as Graph;
  const out: JsonLd[] = [];

  for (const token of graph.include) {
    switch (token) {
      case 'professionalService':
        out.push(professionalServiceJsonLd());
        break;
      case 'faq':
        out.push(faqJsonLd());
        break;
      case 'servicesCatalog':
        out.push(servicesJsonLd());
        break;
      case 'projectList':
        out.push(projectListJsonLd(ctx.projects ?? []));
        break;
      case 'blogList':
        out.push(blogJsonLd(ctx.posts ?? []));
        break;
      case 'certificationsList':
        out.push(certificationsJsonLd(ctx.certifications ?? []));
        break;
      case 'project':
        if (ctx.project) out.push(projectJsonLd(ctx.project));
        break;
      case 'blogPosting':
        if (ctx.post) out.push(blogPostingJsonLd(ctx.post));
        break;
      case 'breadcrumb': {
        // Static crumbs from graph.json, or base + per-item tail for detail routes.
        let crumbs = graph.breadcrumb ?? graph.breadcrumbBase ?? [];
        if (route === 'work-detail' && ctx.project) {
          crumbs = [...crumbs, { name: ctx.project.title, path: `/work/${ctx.project.slug}` }];
        }
        if (route === 'blog-detail' && ctx.post) {
          crumbs = [...crumbs, { name: ctx.post.title, path: `/blog/${ctx.post.slug}` }];
        }
        if (crumbs.length) out.push(breadcrumbJsonLd(crumbs));
        break;
      }
      default:
        break;
    }
  }

  return out;
}
