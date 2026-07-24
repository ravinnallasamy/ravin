import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/seo/seo';

/**
 * robots.txt — generated from the SEO base URL (single source of truth).
 *
 * Policy:
 *  - Everyone may crawl the whole site EXCEPT /api/* (JSON endpoints, no SEO
 *    value) and Next internals.
 *  - AI / answer-engine crawlers are explicitly welcomed by name so there's no
 *    ambiguity — this site WANTS to be read, cited, and surfaced by GEO/AEO
 *    engines (Perplexity, ChatGPT Search, Claude, Gemini/Google SGE, etc.).
 *  - Points crawlers at the sitemap. (llms.txt is served at /llms.txt by the
 *    well-known convention; it needs no robots directive.)
 */

const DISALLOW = ['/api/', '/_next/'];

// Crawlers we explicitly allow full access (both live answer-engine bots and
// model-training bots — full visibility is the goal here).
const AI_CRAWLERS = [
  // OpenAI
  'GPTBot', // model training
  'OAI-SearchBot', // ChatGPT Search / live answers
  'ChatGPT-User', // ChatGPT browsing on a user's behalf
  // Anthropic
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google (AI): Gemini / SGE / Vertex use the Google-Extended token
  'Google-Extended',
  // Apple Intelligence
  'Applebot-Extended',
  // Microsoft Copilot / Bing AI
  'CCBot', // Common Crawl (feeds many LLMs)
  // Others
  'Meta-ExternalAgent',
  'Amazonbot',
  'Bytespider',
  'YouBot',
  'cohere-ai',
  'Diffbot',
  'DuckAssistBot',
  'Timpibot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for every crawler, including all standard search engines.
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      // Explicit welcome for named AI / answer-engine crawlers (same access).
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
