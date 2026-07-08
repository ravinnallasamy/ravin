/**
 * Storage-agnostic cache contract.
 *
 * The whole module talks to this interface, never to a concrete store, so
 * swapping the in-memory implementation for Redis later is a one-line change
 * in `./index.ts` with zero churn elsewhere. The interface is async on
 * purpose — Redis is async, so callers already `await` today.
 */

/** A cached value plus the metadata needed to reason about freshness. */
export interface CacheEntry<T> {
  value: T;
  /** Epoch ms when this entry was stored. */
  storedAt: number;
  /** Epoch ms after which the entry is considered stale. */
  expiresAt: number;
}

export interface CacheStore {
  /** Returns the entry, or null if absent. Does NOT auto-evict on expiry. */
  get<T>(key: string): Promise<CacheEntry<T> | null>;
  /** Stores a value with a TTL in seconds. */
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  /** Removes a key. No-op if absent. */
  delete(key: string): Promise<void>;
  /** Clears every key (test/maintenance). */
  clear(): Promise<void>;
}

/** True when the entry has passed its expiry. */
export function isExpired(entry: CacheEntry<unknown>, now = Date.now()): boolean {
  return now >= entry.expiresAt;
}
