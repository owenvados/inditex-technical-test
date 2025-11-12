import { getGetTopPodcasts } from '@core/di/container';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { PODCAST_CACHE_TTL_MS } from '@podcasts/infrastructure/cache/cacheConstants';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { useUseCaseQuery } from '@shared/hooks/useUseCaseQuery';
import { useEffect } from 'react';

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

  const getTopPodcasts = getGetTopPodcasts();

  const { data, isLoading, isValidating } = useUseCaseQuery<Podcast[]>({
    key: 'top-podcasts',
    execute: () => getTopPodcasts.execute(),
    cache: {
      read: () => podcastCache.getTopPodcasts(),
      write: (podcasts: Podcast[]) => podcastCache.setTopPodcasts(podcasts),
      ttlMs: PODCAST_CACHE_TTL_MS,
    },
    scope: 'useTopPodcasts',
  });

  useEffect(() => {
    if (isValidating) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isValidating, startLoading, stopLoading]);

  return {
    podcasts: data ?? [],
    isLoading,
  };
};
