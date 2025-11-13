import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';

/**
 * Domain service responsible for filtering podcasts by search term.
 * This service implements the filtering logic that searches both
 * podcast titles and author names.
 */
export class PodcastFilterService {
  /**
   * Filters podcasts by search term.
   * Searches in both podcast title and author name (case-insensitive).
   *
   * @param podcasts Array of podcast card DTOs to filter.
   * @param searchTerm Search term to filter by.
   * @returns Filtered array of podcast card DTOs.
   */
  filter(podcasts: PodcastCardDTO[], searchTerm: string): PodcastCardDTO[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return podcasts;
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return podcasts.filter((podcast) => {
      const titleMatch = podcast.title.toLowerCase().includes(normalizedSearchTerm);
      const authorMatch = podcast.author.toLowerCase().includes(normalizedSearchTerm);
      return titleMatch || authorMatch;
    });
  }
}
