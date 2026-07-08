import 'server-only';

/**
 * Authenticated GitHub HTTP client for a single account.
 *
 * Responsibilities: auth headers, REST GET + paginated GET, GraphQL POST,
 * retry with exponential backoff + jitter, and rate-limit awareness. It
 * throws {@link GitHubDashboardError} on hard failures; the account fetcher
 * catches these so nothing propagates uncaught to the UI.
 */

import {
  GITHUB_API_VERSION,
  GITHUB_GRAPHQL_ENDPOINT,
  GITHUB_REST_BASE,
  GITHUB_USER_AGENT,
  MAX_PAGES,
  MAX_PER_PAGE,
  RETRY,
  type AccountKey,
} from '../constants';
import { GitHubDashboardError, kindFromStatus } from '../lib/errors';

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Exponential backoff with jitter, capped at RETRY.maxDelayMs. */
function backoffDelay(attempt: number): number {
  const exp = RETRY.baseDelayMs * 2 ** attempt;
  const jitter = Math.random() * RETRY.jitterMs;
  return Math.min(exp + jitter, RETRY.maxDelayMs);
}

/** Whether a status is worth retrying (transient / rate-limited). */
function isRetryable(status: number): boolean {
  return status === 429 || status === 403 || status >= 500;
}

export interface HttpClientOptions {
  /** ISR revalidate window in seconds, forwarded to fetch. */
  revalidateSeconds: number;
}

export class GitHubHttpClient {
  constructor(
    private readonly account: AccountKey,
    private readonly token: string,
    private readonly options: HttpClientOptions,
  ) {}

  private headers(extra?: Record<string, string>): Record<string, string> {
    return {
      Authorization: `bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
      'User-Agent': GITHUB_USER_AGENT,
      ...extra,
    };
  }

  /** Core fetch with retry/backoff. Honors GitHub's rate-limit reset when known. */
  private async request(url: string, init: RequestInit): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt < RETRY.maxAttempts; attempt += 1) {
      try {
        const res = await fetch(url, {
          ...init,
          headers: this.headers(init.headers as Record<string, string>),
          next: { revalidate: this.options.revalidateSeconds },
        });

        if (res.ok) return res;

        if (isRetryable(res.status) && attempt < RETRY.maxAttempts - 1) {
          await sleep(this.rateLimitDelay(res) ?? backoffDelay(attempt));
          continue;
        }

        throw new GitHubDashboardError(
          this.account,
          kindFromStatus(res.status),
          `GitHub responded ${res.status} for ${url}`,
          res.status,
        );
      } catch (err) {
        lastError = err;
        // Re-throw classified errors we raised ourselves.
        if (err instanceof GitHubDashboardError) throw err;
        // Network error: back off and retry unless out of attempts.
        if (attempt < RETRY.maxAttempts - 1) {
          await sleep(backoffDelay(attempt));
          continue;
        }
      }
    }

    throw new GitHubDashboardError(
      this.account,
      'network',
      `GitHub request failed after ${RETRY.maxAttempts} attempts: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  /**
   * If a 403 carries `x-ratelimit-remaining: 0`, wait until reset (capped).
   * Returns null when the response isn't a rate-limit case.
   */
  private rateLimitDelay(res: Response): number | null {
    if (res.status !== 403 && res.status !== 429) return null;
    if (res.headers.get('x-ratelimit-remaining') !== '0') return null;
    const reset = Number(res.headers.get('x-ratelimit-reset'));
    if (!Number.isFinite(reset)) return null;
    const waitMs = reset * 1000 - Date.now();
    if (waitMs <= 0) return null;
    return Math.min(waitMs, RETRY.maxDelayMs);
  }

  /** REST GET returning parsed JSON of type T. */
  async getJson<T>(path: string): Promise<T> {
    const url = path.startsWith('http') ? path : `${GITHUB_REST_BASE}${path}`;
    const res = await this.request(url, { method: 'GET' });
    return (await res.json()) as T;
  }

  /**
   * REST GET that walks `Link: rel="next"` pagination, accumulating array
   * pages up to MAX_PAGES. `path` should already include `per_page`.
   */
  async getPaginated<T>(path: string): Promise<T[]> {
    const results: T[] = [];
    let url: string | null = path.startsWith('http')
      ? path
      : `${GITHUB_REST_BASE}${path}`;
    let page = 0;

    while (url && page < MAX_PAGES) {
      const res: Response = await this.request(url, { method: 'GET' });
      const chunk = (await res.json()) as T[];
      results.push(...chunk);
      url = parseNextLink(res.headers.get('link'));
      page += 1;
    }
    return results;
  }

  /** GraphQL POST. Throws if the payload carries GraphQL errors. */
  async graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const res = await this.request(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };
    if (json.errors?.length) {
      throw new GitHubDashboardError(
        this.account,
        'unknown',
        `GraphQL error: ${json.errors.map((e) => e.message).join('; ')}`,
      );
    }
    if (!json.data) {
      throw new GitHubDashboardError(
        this.account,
        'unknown',
        'GraphQL response contained no data',
      );
    }
    return json.data;
  }

  /** Convenience: standard `per_page` query fragment. */
  static perPage(n: number = MAX_PER_PAGE): string {
    return `per_page=${Math.min(n, MAX_PER_PAGE)}`;
  }
}

/** Extracts the `rel="next"` URL from a GitHub Link header, or null. */
export function parseNextLink(link: string | null): string | null {
  if (!link) return null;
  for (const part of link.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}
