import {
  getGetPodcastDetail,
  getPodcastDetailService,
  getEpisodeService,
} from '@core/di/container';
import type { EpisodeDetailDTO } from '@podcasts/application/dtos/episode/EpisodeDetailDTO';
import type { PodcastDetailDTO } from '@podcasts/application/dtos/podcast/PodcastDetailDTO';
import type { PodcastDetail } from '@podcasts/domain/models/aggregate/PodcastDetail';
import { PODCAST_CACHE_TTL_MS } from '@podcasts/infrastructure/cache/cacheConstants';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { useUseCaseQuery } from '@shared/hooks/useUseCaseQuery';
import { useMemo, useEffect } from 'react';

interface UsePodcastDetailState {
  podcastDetail: PodcastDetailDTO | null;
  isLoading: boolean;
  // Helper to get full episode detail by ID (for EpisodeDetailPage)
  getEpisodeDetail: (episodeId: string) => EpisodeDetailDTO | null;
}

/**
 * Retrieves podcast detail information and exposes a loading flag.
 * Returns PodcastDetailDTO with optimized EpisodeListItemDTOs for list display.
 * Fetches podcast entities using use cases (with caching),
 * then converts them to DTOs using the service.
 * This ensures presentation layer doesn't need to know about mappers directly.
 *
 * @param podcastId Identifier of the podcast to fetch.
 * @returns Podcast detail DTO along with loading state and helper functions.
 */
export const usePodcastDetail = (podcastId: string | undefined): UsePodcastDetailState => {
  const { startLoading, stopLoading } = useLoadingState();
  const getPodcastDetail = getGetPodcastDetail();
  const podcastDetailService = getPodcastDetailService();
  const episodeService = getEpisodeService();
  const enabled = Boolean(podcastId);

  // Fetch PodcastDetail entity (useUseCaseQuery handles caching)
  const {
    data: originalDetail,
    isLoading,
    isValidating,
  } = useUseCaseQuery<PodcastDetail | null>({
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

  // Convert PodcastDetail entity to DTO using the service
  const podcastDetail = useMemo(() => {
    return originalDetail ? podcastDetailService.mapToDetailDTO(originalDetail) : null;
  }, [originalDetail, podcastDetailService]);

  // Helper function to get full episode detail by ID
  const getEpisodeDetail = useMemo(
    () =>
      (episodeId: string): EpisodeDetailDTO | null => {
        if (!originalDetail) {
          return null;
        }
        const episode = originalDetail.episodes.find((ep) => ep.id === episodeId);
        return episode ? episodeService.mapToDetailDTO(episode) : null;
      },
    [originalDetail, episodeService],
  );

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
    podcastDetail,
    isLoading: Boolean(podcastId) && isLoading,
    getEpisodeDetail,
  };
};
