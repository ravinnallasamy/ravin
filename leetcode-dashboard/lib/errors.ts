/** Error classification shared by the HTTP client and the service layer. */

import type { LeetcodeErrorKind } from '../types';

/** A GraphQL error object as LeetCode returns it (partial). */
export interface GraphQLError {
  message: string;
  extensions?: { handled?: boolean } & Record<string, unknown>;
}

/**
 * Typed error carrying a coarse kind for the UI. The service layer converts
 * these into `ServiceResult.fail(...)` so nothing throws to the caller.
 */
export class LeetcodeDashboardError extends Error {
  readonly kind: LeetcodeErrorKind;
  readonly status?: number;

  constructor(kind: LeetcodeErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'LeetcodeDashboardError';
    this.kind = kind;
    this.status = status;
  }
}

/** Maps an HTTP status to a coarse error kind. */
export function kindFromStatus(status: number): LeetcodeErrorKind {
  if (status === 429) return 'rate-limit';
  if (status === 404) return 'not-found';
  if (status >= 500) return 'network';
  return 'unknown';
}

/**
 * Detects LeetCode's "user does not exist" GraphQL error. That case comes back
 * as HTTP 200 with `{errors:[{message:"That user does not exist.", ...}]}`, so
 * status alone can't classify it — the message must be inspected.
 */
export function isUserNotFound(errors: readonly GraphQLError[]): boolean {
  return errors.some((e) => /user does not exist/i.test(e.message));
}

/** Builds an error from a GraphQL error array, classifying not-found specially. */
export function fromGraphQLErrors(
  errors: readonly GraphQLError[],
): LeetcodeDashboardError {
  const message = errors.map((e) => e.message).join('; ');
  const kind: LeetcodeErrorKind = isUserNotFound(errors)
    ? 'not-found'
    : 'unknown';
  return new LeetcodeDashboardError(kind, `GraphQL error: ${message}`);
}

/** Normalises any thrown value into a `{ message, kind }` pair. */
export function classifyError(err: unknown): {
  message: string;
  kind: LeetcodeErrorKind;
} {
  if (err instanceof LeetcodeDashboardError) {
    return { message: err.message, kind: err.kind };
  }
  const message = err instanceof Error ? err.message : String(err);
  const kind: LeetcodeErrorKind = /fetch|network|ENOTFOUND|ETIMEDOUT/i.test(
    message,
  )
    ? 'network'
    : 'unknown';
  return { message, kind };
}
