import { getGetTopPodcasts, getPodcastCardService } from '@core/di/container';
import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';
import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';
import { PODCAST_CACHE_TTL_MS } from '@podcasts/infrastructure/cache/cacheConstants';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { useUseCaseQuery } from '@shared/hooks/useUseCaseQuery';
import { useMemo, useEffect } from 'react';

interface UseTopPodcastsState {
  podcasts: PodcastCardDTO[];
  isLoading: boolean;
}

/**
 * Provides the top podcasts catalogue as DTOs along with a loading indicator.
 * This hook fetches podcast entities using use cases (with caching),
 * then converts them to DTOs using the service.
 * This ensures presentation layer doesn't need to know about mappers directly.
 *
 * @returns Current list of podcast card DTOs and loading flag.
 */
export const useTopPodcasts = (): UseTopPodcastsState => {
  const { startLoading, stopLoading } = useLoadingState();

  const getTopPodcasts = getGetTopPodcasts();
  const podcastCardService = getPodcastCardService();

  // Fetch Podcast entities (useUseCaseQuery handles caching)
  const {
    data: podcasts,
    isLoading,
    isValidating,
  } = useUseCaseQuery<Podcast[]>({
    key: 'top-podcasts',
    execute: () => getTopPodcasts.execute(),
    cache: {
      read: () => podcastCache.getTopPodcasts() ?? undefined,
      write: (podcasts: Podcast[]) => podcastCache.setTopPodcasts(podcasts),
      ttlMs: PODCAST_CACHE_TTL_MS,
    },
    scope: 'useTopPodcasts',
  });

  // Convert Podcast entities to DTOs using the service
  const podcastDTOs = useMemo(() => {
    return podcasts ? podcastCardService.mapToCardDTOs(podcasts) : [];
  }, [podcasts, podcastCardService]);

  useEffect(() => {
    if (isValidating) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isValidating, startLoading, stopLoading]);

  return {
    podcasts: podcastDTOs,
    isLoading,
  };
};
