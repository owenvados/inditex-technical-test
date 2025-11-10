import { GetPodcastDetail } from '@podcasts/application/use-cases/GetPodcastDetail';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { PODCAST_CACHE_TTL_MS } from '@podcasts/infrastructure/cache/cacheConstants';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { logError } from '@shared/utils/errors/errorLogger';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';

const repository = new ITunesPodcastRepository();
const getPodcastDetail = new GetPodcastDetail(repository);

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
  const cacheKey = useMemo(() => (podcastId ? `podcast-detail:${podcastId}` : null), [podcastId]);

  const cachedDetail = useMemo(
    () => (podcastId ? podcastCache.getPodcastDetail(podcastId) : null),
    [podcastId],
  );

  const shouldRevalidate = !cachedDetail;

  const { data, isLoading, isValidating } = useSWR(
    cacheKey,
    async () => {
      if (!podcastId) {
        return null;
      }
      const detail = await getPodcastDetail.execute(podcastId);
      podcastCache.setPodcastDetail(podcastId, detail);
      return detail;
    },
    {
      fallbackData: cachedDetail ?? undefined,
      revalidateOnMount: shouldRevalidate,
      revalidateIfStale: shouldRevalidate,
      revalidateOnFocus: false,
      dedupingInterval: PODCAST_CACHE_TTL_MS,
      onError: (error) => {
        logError('usePodcastDetail', error);
      },
    },
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
    podcastDetail: data ?? null,
    isLoading: Boolean(podcastId) && Boolean(isLoading || isValidating),
  };
};
