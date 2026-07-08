import type { CacheEntry, CacheStore } from './types';

/**
 * Process-local, in-memory cache.
 *
 * Deliberately kept behind {@link CacheStore} so a Redis-backed store can
 * replace it without touching callers. Survives across requests within a
 * single server process (the Next.js Node runtime), which is exactly the
 * "don't fetch on every request" guarantee we need. It does NOT survive
 * across serverless cold starts — acceptable, since the scheduler + ISR
 * revalidate cover that case, and Redis is the documented upgrade path.
 */
export class MemoryCacheStore implements CacheStore {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    const entry = this.store.get(key);
    return (entry as CacheEntry<T> | undefined) ?? null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const now = Date.now();
    this.store.set(key, {
      value,
      storedAt: now,
      expiresAt: now + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
