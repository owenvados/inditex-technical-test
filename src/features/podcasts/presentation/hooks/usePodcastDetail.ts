import { getGetPodcastDetail } from '@core/di/container';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { PODCAST_CACHE_TTL_MS } from '@podcasts/infrastructure/cache/cacheConstants';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { useUseCaseQuery } from '@shared/hooks/useUseCaseQuery';
import { useEffect } from 'react';

interface UsePodcastDetailState {
  podcastDetail: PodcastDetail | null;
  isLoading: boolean;
}

/**
 * Retrieves podcast detail information and exposes a loading flag.
 *
 * @param podcastId Identifier of the podcast to fetch.
 * @returns Latest podcast detail along with loading state.
 */
export const usePodcastDetail = (podcastId: string | undefined): UsePodcastDetailState => {
  const { startLoading, stopLoading } = useLoadingState();
  const getPodcastDetail = getGetPodcastDetail();
  const enabled = Boolean(podcastId);

  const { data, isLoading, isValidating } = useUseCaseQuery<PodcastDetail | null>({
    key: enabled ? `podcast-detail:${podcastId}` : null,
    execute: () => {
      if (!podcastId) {
        return Promise.resolve(null);
      }
      return getPodcastDetail.execute(podcastId);
    },
    cache: enabled
      ? {
          read: () => podcastCache.getPodcastDetail(podcastId!),
          write: (detail: PodcastDetail | null) => {
            if (detail && podcastId) {
              podcastCache.setPodcastDetail(podcastId!, detail);
            }
          },
          ttlMs: PODCAST_CACHE_TTL_MS,
        }
      : undefined,
    enabled,
    scope: 'usePodcastDetail',
  });

  useEffect(() => {
    if (!podcastId) {
      stopLoading();
      return;
    }

    if (isValidating) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isValidating, podcastId, startLoading, stopLoading]);

  return {
    podcastDetail: data ?? null,
    isLoading: Boolean(podcastId) && isLoading,
  };
};
