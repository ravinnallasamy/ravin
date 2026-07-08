/** Error classification shared by the service and the merge/assembly layer. */

import type { AccountError } from '../types';
import type { AccountKey } from '../constants';

/** Typed error carrying an account key and a coarse kind for the UI. */
export class GitHubDashboardError extends Error {
  readonly account: AccountKey;
  readonly kind: AccountError['kind'];
  readonly status?: number;

  constructor(
    account: AccountKey,
    kind: AccountError['kind'],
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = 'GitHubDashboardError';
    this.account = account;
    this.kind = kind;
    this.status = status;
  }

  toAccountError(): AccountError {
    return { account: this.account, message: this.message, kind: this.kind };
  }
}

/** Maps an HTTP status to a coarse error kind. */
export function kindFromStatus(status: number): AccountError['kind'] {
  if (status === 401 || status === 403) {
    return status === 403 ? 'rate-limit' : 'auth';
  }
  if (status === 404) return 'not-found';
  if (status >= 500) return 'network';
  return 'unknown';
}

/** Normalises any thrown value into an AccountError for a given account. */
export function toAccountError(account: AccountKey, err: unknown): AccountError {
  if (err instanceof GitHubDashboardError) return err.toAccountError();
  const message = err instanceof Error ? err.message : String(err);
  const kind: AccountError['kind'] = /fetch|network|ENOTFOUND|ETIMEDOUT/i.test(
    message,
  )
    ? 'network'
    : 'unknown';
  return { account, message, kind };
}
