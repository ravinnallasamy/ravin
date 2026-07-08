import { MemoryCacheStore } from './memory-store';
import { isExpired, type CacheEntry, type CacheStore } from './types';

export type { CacheEntry, CacheStore } from './types';
export { isExpired } from './types';

/**
 * The single shared cache instance for the module.
 *
 * Swap this line for a Redis-backed `CacheStore` to migrate — every consumer
 * imports `leetcodeCache` and depends only on the interface.
 *
 * A module-level singleton is intentional: it persists across requests in the
 * same Node process. `globalThis` guards against duplicate instances when the
 * dev server hot-reloads this module.
 */
const globalForCache = globalThis as unknown as {
  __leetcodeDashboardCache?: CacheStore;
};

export const leetcodeCache: CacheStore =
  globalForCache.__leetcodeDashboardCache ??
  (globalForCache.__leetcodeDashboardCache = new MemoryCacheStore());

/** What `readThrough` tells the caller about where the value came from. */
export interface ReadThroughResult<T> {
  value: T;
  /** True when served from cache; false when freshly produced. */
  fromCache: boolean;
  /** True when a cached value was returned despite being past its TTL. */
  stale: boolean;
}

/**
 * Cache-aside helper with stale-if-error semantics.
 *
 * 1. Fresh cache hit  -> return it, no fetch.
 * 2. Miss or expired  -> run `producer`, cache the result, return it.
 * 3. `producer` throws AND a stale entry exists -> return the stale entry
 *    (resilience: a transient upstream failure never blanks the dashboard).
 * 4. `producer` throws and nothing is cached -> rethrow (nothing to serve).
 */
export async function readThrough<T>(
  key: string,
  ttlSeconds: number,
  producer: () => Promise<T>,
  store: CacheStore = leetcodeCache,
): Promise<ReadThroughResult<T>> {
  const existing = (await store.get<T>(key)) as CacheEntry<T> | null;

  if (existing && !isExpired(existing)) {
    return { value: existing.value, fromCache: true, stale: false };
  }

  try {
    const value = await producer();
    await store.set(key, value, ttlSeconds);
    return { value, fromCache: false, stale: false };
  } catch (error) {
    if (existing) {
      return { value: existing.value, fromCache: true, stale: true };
    }
    throw error;
  }
}
