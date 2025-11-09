import { GetTopPodcasts } from '@podcasts/application/use-cases/GetTopPodcasts';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { useLoadingState } from '@shared/hooks/useLoadingState';
import { useEffect, useState } from 'react';

const repository = new ITunesPodcastRepository();
const getTopPodcasts = new GetTopPodcasts(repository);

interface UseTopPodcastsState {
  podcasts: Podcast[];
  isLoading: boolean;
}

const INITIAL_STATE: UseTopPodcastsState = {
  podcasts: [],
  isLoading: false,
};

export const useTopPodcasts = (): UseTopPodcastsState => {
  const [state, setState] = useState<UseTopPodcastsState>(INITIAL_STATE);
  const { startLoading, stopLoading } = useLoadingState();

  useEffect(() => {
    let cancelled = false;

    const loadPodcasts = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      startLoading();

      try {
        const podcasts = await getTopPodcasts.execute();

        if (!cancelled) {
          setState({ podcasts, isLoading: false });
        }
      } catch (error) {
        console.error('[useTopPodcasts] Failed to load podcasts', error);

        if (!cancelled) {
          setState({ podcasts: [], isLoading: false });
        }
      } finally {
        stopLoading();
      }
    };

    loadPodcasts();

    return () => {
      cancelled = true;
    };
  }, [startLoading, stopLoading]);

  return state;
};
