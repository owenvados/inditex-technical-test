import { logError } from '@shared/utils/errors/errorLogger';
import useSWR from 'swr';

interface CacheStrategy<TValue> {
  read: () => TValue | null | undefined;
  write: (value: TValue) => void;
  ttlMs: number;
}

interface UseCaseQueryOptions<TValue> {
  key: string | null;
  execute: () => Promise<TValue>;
  cache?: CacheStrategy<TValue>;
  enabled?: boolean;
  scope?: string;
}

export interface UseCaseQueryResult<TValue> {
  data: TValue | undefined;
  error: unknown;
  isLoading: boolean;
  isValidating: boolean;
}

/**
 * Hook that executes a use case and automatically manages caching.
 *
 * This hook wraps SWR to provide a consistent interface for executing application
 * use cases with built-in caching support. It handles:
 * 1. Reading cached data if available
 * 2. Executing the use case asynchronously
 * 3. Writing results to the cache
 * 4. Returning undefined data on error (not cached fallback data)
 * 5. Providing loading and validation states
 *
 * @template TValue - Type of the data returned by the use case.
 * @param options - Configuration options for the query.
 * @param options.key - Unique cache identifier. When null, the query is disabled.
 * @param options.execute - Asynchronous function that executes the use case.
 * @param options.cache - Optional cache strategy for fallback data.
 * @param options.enabled - Whether the query should execute. Defaults to true.
 * @param options.scope - Scope identifier for structured error logging.
 * @returns Object containing data, error state, and loading indicators.
 */
export const useUseCaseQuery = <TValue>({
  key,
  execute,
  cache,
  enabled = true,
  scope,
}: UseCaseQueryOptions<TValue>): UseCaseQueryResult<TValue> => {
  // Read cached data if available
  const cachedValue = cache?.read();
  const fallbackData = cachedValue ?? undefined;

  // Only revalidate if there's no cached data
  const shouldRevalidate = enabled && !cachedValue;

  // Execute the use case using SWR
  const { data, error, isLoading, isValidating } = useSWR<TValue>(
    enabled ? key : null,
    async () => {
      // Execute the use case
      const result = await execute();
      // Save to cache
      cache?.write(result);
      return result;
    },
    {
      // Use cached data while loading
      fallbackData,
      // Only revalidate if there's no cache
      revalidateOnMount: shouldRevalidate,
      revalidateIfStale: shouldRevalidate,
      revalidateOnFocus: false,
      // Avoid multiple requests during cache TTL
      dedupingInterval: cache?.ttlMs,
      // Handle errors
      onError: (err) => {
        if (scope) {
          logError(scope, err);
        } else {
          console.error(err);
        }
      },
      // Don't keep previous data or retry on error
      keepPreviousData: false,
      onErrorRetry: () => {},
      shouldRetryOnError: false,
    },
  );

  // If there's an error, don't return data (not even from cache)
  const resultData = error ? undefined : data;

  // Calculate if currently loading
  // isLoading: true when SWR is loading for the first time (no previous data)
  // isValidating && !cachedValue: true when validating but no cache exists
  const isCurrentlyLoading = isLoading || (enabled && isValidating && !cachedValue);

  return {
    data: resultData,
    error,
    isLoading: isCurrentlyLoading,
    isValidating: Boolean(isValidating),
  };
};
