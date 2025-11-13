import { PodcastFilterService } from '@podcasts/domain/services/PodcastFilterService';

import type { PodcastCardDTO } from '../../dtos/podcast/PodcastCardDTO';

/**
 * Use case responsible for filtering podcasts by search term.
 * This use case delegates to the domain service for the actual filtering logic.
 */
export class FilterPodcasts {
  private readonly filterService: PodcastFilterService;

  constructor(filterService: PodcastFilterService = new PodcastFilterService()) {
    this.filterService = filterService;
  }

  /**
   * Filters podcasts by search term.
   * Delegates to the domain service for the actual filtering logic.
   *
   * @param podcastCards Collection of podcast cards that should be filtered.
   * @param searchTerm Keyword to match against the podcast data.
   * @returns A filtered collection of podcast cards.
   */
  execute(podcastCards: PodcastCardDTO[], searchTerm: string): PodcastCardDTO[] {
    return this.filterService.filter(podcastCards, searchTerm);
  }
}
