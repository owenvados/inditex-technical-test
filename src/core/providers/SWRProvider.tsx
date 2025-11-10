import React, { useEffect, useMemo } from 'react';
import type { Cache } from 'swr';
import { SWRConfig } from 'swr';

const SWR_CACHE_KEY = 'swr-cache';

const isBrowserEnvironment = (): boolean => typeof window !== 'undefined';

const loadCacheFromStorage = (): Cache => {
  const cacheMap = new Map<string, unknown>() as unknown as Cache;

  if (!isBrowserEnvironment()) {
    return cacheMap;
  }

  try {
    const rawCache = window.localStorage.getItem(SWR_CACHE_KEY);

    if (!rawCache) {
      return cacheMap;
    }

    const parsedEntries = JSON.parse(rawCache) as [string, unknown][];

    if (!Array.isArray(parsedEntries)) {
      return cacheMap;
    }

    for (const [key, value] of parsedEntries) {
      (cacheMap as Map<string, unknown>).set(key, value);
    }
  } catch (error) {
    console.error('[SWRProvider] Failed to parse cached data', error);
  }

  return cacheMap;
};

const persistCacheToStorage = (cache: Cache) => {
  if (!isBrowserEnvironment()) {
    return;
  }

  try {
    const entries = Array.from((cache as Map<string, unknown>).entries());
    window.localStorage.setItem(SWR_CACHE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('[SWRProvider] Failed to persist cache data', error);
  }
};

/**
 * Global SWR provider that persists cache entries in local storage.
 *
 * @param props.children React subtree that can access SWR context.
 * @returns SWR configuration provider wiring the persistent cache.
 */
export const SWRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cacheMap = useMemo(() => loadCacheFromStorage(), []);

  useEffect(() => {
    if (!isBrowserEnvironment()) {
      return undefined;
    }

    const handleBeforeUnload = () => {
      persistCacheToStorage(cacheMap);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      persistCacheToStorage(cacheMap);
    };
  }, [cacheMap]);

  return (
    <SWRConfig
      value={{
        provider: () => cacheMap,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
