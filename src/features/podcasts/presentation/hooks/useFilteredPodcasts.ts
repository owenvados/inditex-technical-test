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
 * Custom hook that provides a filtered list of podcasts with debounced search.
 * Filters podcasts by matching the search term against title and author fields.
 * Uses debouncing to reduce filtering operations while the user is typing.
 *
 * @param searchTerm Search keyword to filter podcasts by title and author.
 * @returns Object containing filtered podcasts, total count, filtered count, and loading state.
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
