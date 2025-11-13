import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';
import { FilterPodcasts } from '@podcasts/application/use-cases/podcast/FilterPodcasts';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useMemo } from 'react';

import { useTopPodcasts } from './useTopPodcasts';

const filterPodcastsUseCase = new FilterPodcasts();

interface UseFilteredPodcastsState {
  podcasts: PodcastCardDTO[];
  totalCount: number;
  filteredCount: number;
  isLoading: boolean;
}

/**
 * Provides a debounced, filtered list of podcast cards derived from the cached catalogue.
 *
 * @param searchTerm Raw text that should be applied to the podcast list.
 * @returns Filtered podcast card DTOs alongside loading indicators and counts.
 */
export const useFilteredPodcasts = (searchTerm: string): UseFilteredPodcastsState => {
  const { podcasts, isLoading } = useTopPodcasts();
  const debouncedSearchTerm = useDebounce(searchTerm);

  const filteredPodcasts = useMemo(
    () => filterPodcastsUseCase.execute(podcasts, debouncedSearchTerm),
    [podcasts, debouncedSearchTerm],
  );

  return {
    podcasts: filteredPodcasts,
    totalCount: podcasts.length,
    filteredCount: filteredPodcasts.length,
    isLoading,
  };
};
