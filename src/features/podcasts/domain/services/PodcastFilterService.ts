import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';

/**
 * Domain service that provides podcast filtering functionality.
 * Implements the business logic for searching podcasts by matching
 * against title and author fields using case-insensitive comparison.
 */
export class PodcastFilterService {
  /**
   * Filters the provided podcast cards based on the search term.
   * The search is case-insensitive and matches against both title and author.
   * Returns all podcasts if the search term is empty or whitespace.
   *
   * @param podcastCards Array of podcast cards to filter.
   * @param searchTerm Search keyword to match against podcast title and author.
   * @returns Filtered array of podcast cards that match the search term.
   */
  filter(podcastCards: PodcastCardDTO[], searchTerm: string): PodcastCardDTO[] {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return podcastCards;
    }

    return podcastCards.filter((podcast) => {
      const podcastTitle = podcast.title.toLowerCase();
      const podcastAuthor = podcast.author.toLowerCase();

      return podcastTitle.includes(normalizedTerm) || podcastAuthor.includes(normalizedTerm);
    });
  }
}
