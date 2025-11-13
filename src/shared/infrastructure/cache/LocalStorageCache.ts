export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class LocalStorageCache {
  constructor(private readonly namespace: string) {}

  get<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const storageKey = `${this.namespace}:${key}`;
      const rawValue = window.localStorage.getItem(storageKey);

      if (!rawValue) {
        return null;
      }

      const entry = JSON.parse(rawValue) as CacheEntry<T>;

      if (!entry || typeof entry !== 'object') {
        window.localStorage.removeItem(storageKey);
        return null;
      }

      if (typeof entry.expiresAt !== 'number' || entry.expiresAt <= Date.now()) {
        window.localStorage.removeItem(storageKey);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('[LocalStorageCache] Failed to read cache entry', error);
      return null;
    }
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    if (typeof window === 'undefined' || !window.localStorage) {
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
      window.localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('[LocalStorageCache] Failed to persist cache entry', error);
    }
  }

  remove(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.removeItem(`${this.namespace}:${key}`);
    } catch (error) {
      console.error('[LocalStorageCache] Failed to remove cache entry', error);
    }
  }
}
