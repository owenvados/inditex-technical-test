import React, { useEffect, useMemo } from 'react';
import type { Cache } from 'swr';
import { SWRConfig } from 'swr';

const SWR_CACHE_KEY = 'swr-cache';
const isBrowser = (): boolean => typeof window !== 'undefined';

const readCache = (): Map<string, unknown> => {
  if (!isBrowser()) {
    return new Map<string, unknown>();
  }

  try {
    const rawCache = window.localStorage.getItem(SWR_CACHE_KEY);
    if (!rawCache) {
      return new Map<string, unknown>();
    }

    const entries = JSON.parse(rawCache) as [string, unknown][];
    return Array.isArray(entries) ? new Map<string, unknown>(entries) : new Map();
  } catch (error) {
    console.error('[SWRProvider] Failed to parse cached data', error);
    return new Map<string, unknown>();
  }
};

const writeCache = (cache: Map<string, unknown>) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(SWR_CACHE_KEY, JSON.stringify(Array.from(cache.entries())));
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
  const cache = useMemo(() => readCache(), []);

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    const handleBeforeUnload = () => writeCache(cache);

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      writeCache(cache);
    };
  }, [cache]);

  return (
    <SWRConfig
      value={{
        provider: () => cache as unknown as Cache,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
