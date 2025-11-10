/**
 * Local storage backed cache with expiration support.
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const isBrowserEnvironment = (): boolean => typeof window !== 'undefined' && !!window.localStorage;

/**
 * Provides a namespaced cache persisted in `localStorage`.
 */
export class LocalStorageCache {
  constructor(private readonly namespace: string) {}

  /**
   * Retrieves a cached value if it exists and is not expired.
   *
   * @param key Cache entry identifier.
   * @returns Cached data or null when missing/expired/unavailable.
   */
  get<T>(key: string): T | null {
    if (!isBrowserEnvironment()) {
      return null;
    }

    try {
      const storageKey = this.buildStorageKey(key);
      const rawValue = window.localStorage.getItem(storageKey);

      if (!rawValue) {
        return null;
      }

      const entry = JSON.parse(rawValue) as CacheEntry<T>;

      if (!entry || typeof entry !== 'object') {
        window.localStorage.removeItem(storageKey);
        return null;
      }

      if (this.isExpired(entry)) {
        window.localStorage.removeItem(storageKey);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('[LocalStorageCache] Failed to read cache entry', error);
      return null;
    }
  }

  /**
   * Stores a value in cache with a time-to-live.
   *
   * @param key Cache entry identifier.
   * @param data Serializable data to store.
   * @param ttlMs Expiration time in milliseconds.
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    if (!isBrowserEnvironment()) {
      return;
    }

    if (ttlMs <= 0) {
      this.remove(key);
      return;
    }

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttlMs,
      };

      const storageKey = this.buildStorageKey(key);
      window.localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.error('[LocalStorageCache] Failed to persist cache entry', error);
    }
  }

  /**
   * Removes the given entry from the cache store.
   *
   * @param key Cache entry identifier.
   */
  remove(key: string): void {
    if (!isBrowserEnvironment()) {
      return;
    }

    try {
      const storageKey = this.buildStorageKey(key);
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('[LocalStorageCache] Failed to remove cache entry', error);
    }
  }

  private buildStorageKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return typeof entry.expiresAt !== 'number' || entry.expiresAt <= Date.now();
  }
}
