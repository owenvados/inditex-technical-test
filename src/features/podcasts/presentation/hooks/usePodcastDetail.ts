import { GetPodcastDetail } from '@podcasts/application/use-cases/GetPodcastDetail';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { logError } from '@shared/utils/errors/errorLogger';
import { useEffect, useState } from 'react';

const repository = new ITunesPodcastRepository();
const getPodcastDetail = new GetPodcastDetail(repository);

interface UsePodcastDetailState {
  podcastDetail: PodcastDetail | null;
  isLoading: boolean;
}

const INITIAL_STATE: UsePodcastDetailState = {
  podcastDetail: null,
  isLoading: false,
};

/**
 * Retrieves podcast detail information and exposes a loading flag.
 *
 * @param podcastId Identifier of the podcast to fetch.
 * @returns Latest podcast detail along with loading state.
 */
export const usePodcastDetail = (podcastId: string | undefined): UsePodcastDetailState => {
  const [state, setState] = useState<UsePodcastDetailState>(INITIAL_STATE);
  const { startLoading, stopLoading } = useLoadingState();

  useEffect(() => {
    let cancelled = false;

    const fetchPodcastDetail = async () => {
      if (!podcastId) {
        if (!cancelled) {
          setState({ podcastDetail: null, isLoading: false });
        }
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));
      startLoading();

      try {
        const detail = await getPodcastDetail.execute(podcastId);

        if (!cancelled) {
          setState({ podcastDetail: detail, isLoading: false });
        }
      } catch (error) {
        logError('usePodcastDetail', error);

        if (!cancelled) {
          setState({ podcastDetail: null, isLoading: false });
        }
      } finally {
        stopLoading();
      }
    };

    fetchPodcastDetail();

    return () => {
      cancelled = true;
    };
  }, [podcastId, startLoading, stopLoading]);

  return state;
};
