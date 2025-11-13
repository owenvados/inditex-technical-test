import { PodcastFilterService } from '@podcasts/domain/services/PodcastFilterService';

import type { PodcastCardDTO } from '../../dtos/podcast/PodcastCardDTO';

/**
 * Use case that orchestrates the filtering of podcasts by search term.
 * Delegates the filtering logic to the domain service.
 */
export class FilterPodcasts {
  private readonly filterService: PodcastFilterService;

  /**
   * Creates an instance of the FilterPodcasts use case.
   *
   * @param filterService Domain service that performs the actual filtering logic.
   */
  constructor(filterService: PodcastFilterService = new PodcastFilterService()) {
    this.filterService = filterService;
  }

  /**
   * Filters the provided podcast cards based on the search term.
   * Uses the domain service to perform case-insensitive matching against title and author.
   *
   * @param podcastCards Array of podcast cards to filter.
   * @param searchTerm Search keyword to match against podcast data.
   * @returns Filtered array of podcast cards that match the search term.
   */
  execute(podcastCards: PodcastCardDTO[], searchTerm: string): PodcastCardDTO[] {
    return this.filterService.filter(podcastCards, searchTerm);
  }
}
