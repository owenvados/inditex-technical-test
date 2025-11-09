import { GetPodcastDetail } from '@podcasts/application/use-cases/GetPodcastDetail';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { useEffect, useState } from 'react';

const repository = new ITunesPodcastRepository();
const getPodcastDetail = new GetPodcastDetail(repository);

interface UsePodcastDetailState {
  podcastDetail: PodcastDetail | null;
  isLoading: boolean;
  error?: string;
}

const INITIAL_STATE: UsePodcastDetailState = {
  podcastDetail: null,
  isLoading: false,
  error: undefined,
};

export const usePodcastDetail = (podcastId: string | undefined): UsePodcastDetailState => {
  const [state, setState] = useState<UsePodcastDetailState>(INITIAL_STATE);
  const { startLoading, stopLoading } = useLoadingState();

  useEffect(() => {
    if (!podcastId) {
      setState({ podcastDetail: null, isLoading: false, error: 'Podcast ID is required' });
      return;
    }

    let cancelled = false;

    const fetchPodcastDetail = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
      startLoading();

      try {
        const detail = await getPodcastDetail.execute(podcastId);

        if (!cancelled) {
          setState({ podcastDetail: detail, isLoading: false, error: undefined });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error';
        console.error('[usePodcastDetail] Failed to retrieve podcast detail', error);

        if (!cancelled) {
          setState({ podcastDetail: null, isLoading: false, error: message });
        }
      } finally {
        stopLoading();

        if (!cancelled) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchPodcastDetail();

    return () => {
      cancelled = true;
    };
  }, [podcastId, startLoading, stopLoading]);

  return state;
};
