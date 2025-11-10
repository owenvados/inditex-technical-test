import { FilterPodcasts } from '@podcasts/application/use-cases/FilterPodcasts';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useMemo } from 'react';

import { useTopPodcasts } from './useTopPodcasts';

const filterPodcastsUseCase = new FilterPodcasts();

interface UseFilteredPodcastsState {
  podcasts: Podcast[];
  totalCount: number;
  filteredCount: number;
  isLoading: boolean;
}

/**
 * Provides a debounced, filtered list of podcasts derived from the cached catalogue.
 *
 * @param searchTerm Raw text that should be applied to the podcast list.
 * @returns Filtered podcasts alongside loading indicators and counts.
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
