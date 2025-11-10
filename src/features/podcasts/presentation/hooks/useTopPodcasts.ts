import { GetTopPodcasts } from '@podcasts/application/use-cases/GetTopPodcasts';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { PODCAST_CACHE_TTL_MS } from '@podcasts/infrastructure/cache/cacheConstants';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { logError } from '@shared/utils/errors/errorLogger';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';

const repository = new ITunesPodcastRepository();
const getTopPodcasts = new GetTopPodcasts(repository);

interface UseTopPodcastsState {
  podcasts: Podcast[];
  isLoading: boolean;
}

/**
 * Provides the top podcasts catalogue along with a loading indicator.
 *
 * @returns Current list of podcasts and loading flag.
 */
export const useTopPodcasts = (): UseTopPodcastsState => {
  const { startLoading, stopLoading } = useLoadingState();
  const cachedPodcasts = useMemo(() => podcastCache.getTopPodcasts(), []);

  const shouldRevalidate = !cachedPodcasts;

  const { data, isValidating, isLoading } = useSWR(
    'top-podcasts',
    async () => {
      const podcasts = await getTopPodcasts.execute();
      podcastCache.setTopPodcasts(podcasts);
      return podcasts;
    },
    {
      fallbackData: cachedPodcasts ?? undefined,
      revalidateOnMount: shouldRevalidate,
      revalidateIfStale: shouldRevalidate,
      revalidateOnFocus: false,
      dedupingInterval: PODCAST_CACHE_TTL_MS,
      onError: (error) => {
        logError('useTopPodcasts', error);
      },
    },
  );

  useEffect(() => {
    if (isValidating) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isValidating, startLoading, stopLoading]);

  return {
    podcasts: data ?? [],
    isLoading: Boolean(isLoading || isValidating),
  };
};
