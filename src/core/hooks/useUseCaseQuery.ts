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
 * Shared SWR wrapper that executes application use cases and applies cache policies.
 *
 * @param options.key Unique cache identifier; when null the query is disabled.
 * @param options.execute Asynchronous use case execution function.
 * @param options.cache Optional local cache strategy for fallback data.
 * @param options.enabled Indicates if the query should execute.
 * @param options.scope Identifier used for structured error logging.
 * @returns Normalised SWR response describing the request lifecycle.
 */
export const useUseCaseQuery = <TValue>({
  key,
  execute,
  cache,
  enabled = true,
  scope,
}: UseCaseQueryOptions<TValue>): UseCaseQueryResult<TValue> => {
  const cachedValue = cache?.read();
  const hasCachedValue = cachedValue !== null && cachedValue !== undefined;
  const fallbackData = hasCachedValue ? (cachedValue as TValue) : undefined;
  const shouldRevalidate = enabled && !hasCachedValue;

  const { data, error, isLoading, isValidating } = useSWR<TValue>(
    enabled ? key : null,
    async () => {
      const result = await execute();
      cache?.write(result);
      return result;
    },
    {
      fallbackData,
      revalidateOnMount: shouldRevalidate,
      revalidateIfStale: shouldRevalidate,
      revalidateOnFocus: false,
      dedupingInterval: cache?.ttlMs,
      onError: (useCaseError) => {
        if (scope) {
          logError(scope, useCaseError);
          return;
        }

        console.error(useCaseError);
      },
    },
  );

  return {
    data,
    error,
    isLoading: Boolean(isLoading || (enabled && isValidating && !hasCachedValue)),
    isValidating: Boolean(isValidating),
  };
};
