import 'server-only';

/**
 * Public LeetCode GraphQL HTTP client.
 *
 * Responsibilities: POST a GraphQL document to the public endpoint, retry
 * transient failures with exponential backoff + jitter, and surface GraphQL
 * errors as classified {@link LeetcodeDashboardError}s. No auth, cookies, or
 * CSRF — LeetCode's public profile GraphQL needs none. The service layer
 * catches everything this throws, so nothing propagates uncaught to the UI.
 */

import {
  LEETCODE_GRAPHQL_ENDPOINT,
  LEETCODE_REFERER,
  LEETCODE_USER_AGENT,
  RETRY,
} from '../constants';
import {
  LeetcodeDashboardError,
  fromGraphQLErrors,
  kindFromStatus,
  type GraphQLError,
} from '../lib/errors';

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
  return status === 429 || status >= 500;
}

export interface HttpClientOptions {
  /** ISR revalidate window in seconds, forwarded to fetch. */
  revalidateSeconds: number;
}

/** Raw GraphQL envelope before we validate/normalise `data`. */
interface GraphQLEnvelope<T> {
  data?: T | null;
  errors?: GraphQLError[];
}

export class LeetcodeHttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Referer: LEETCODE_REFERER,
      'User-Agent': LEETCODE_USER_AGENT,
    };
  }

  /** Core fetch with retry/backoff. Throws a classified error on hard failure. */
  private async request(body: string): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt < RETRY.maxAttempts; attempt += 1) {
      try {
        const res = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: this.headers(),
          body,
          next: { revalidate: this.options.revalidateSeconds },
        });

        if (res.ok) return res;

        if (isRetryable(res.status) && attempt < RETRY.maxAttempts - 1) {
          await sleep(backoffDelay(attempt));
          continue;
        }

        throw new LeetcodeDashboardError(
          kindFromStatus(res.status),
          `LeetCode responded ${res.status}`,
          res.status,
        );
      } catch (err) {
        lastError = err;
        // Re-throw classified errors we raised ourselves.
        if (err instanceof LeetcodeDashboardError) throw err;
        // Network error: back off and retry unless out of attempts.
        if (attempt < RETRY.maxAttempts - 1) {
          await sleep(backoffDelay(attempt));
          continue;
        }
      }
    }

    throw new LeetcodeDashboardError(
      'network',
      `LeetCode request failed after ${RETRY.maxAttempts} attempts: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  /**
   * Executes a GraphQL query and returns typed `data`.
   *
   * LeetCode returns HTTP 200 even for a non-existent user, carrying the error
   * in the `errors` array — so we classify GraphQL errors here (not-found vs.
   * other) via {@link fromGraphQLErrors} rather than trusting the status.
   */
  async query<T>(
    document: string,
    variables: Record<string, unknown>,
  ): Promise<T> {
    const res = await this.request(
      JSON.stringify({ query: document, variables }),
    );

    let json: GraphQLEnvelope<T>;
    try {
      json = (await res.json()) as GraphQLEnvelope<T>;
    } catch {
      throw new LeetcodeDashboardError(
        'malformed',
        'LeetCode returned a non-JSON response',
      );
    }

    if (json.errors?.length) {
      throw fromGraphQLErrors(json.errors);
    }
    if (json.data === undefined || json.data === null) {
      throw new LeetcodeDashboardError(
        'malformed',
        'GraphQL response contained no data',
      );
    }
    return json.data;
  }
}
