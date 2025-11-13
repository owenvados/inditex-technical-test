import type { Podcast } from '@podcasts/domain/entities/Podcast';

/**
 * Use case that filters podcasts by search term.
 * Implements case-insensitive matching against title and author fields.
 */
export class FilterPodcasts {
  /**
   * Filters the provided podcasts based on the search term.
   * The search is case-insensitive and matches against both title and author.
   * Returns all podcasts if the search term is empty or whitespace.
   *
   * @param podcasts Array of podcast entities to filter.
   * @param searchTerm Search keyword to match against podcast title and author.
   * @returns Filtered array of podcast entities that match the search term.
   */
  execute(podcasts: Podcast[], searchTerm: string): Podcast[] {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return podcasts;
    }

    return podcasts.filter((podcast) => {
      const podcastTitle = podcast.title.toLowerCase();
      const podcastAuthor = podcast.author.toLowerCase();

      return podcastTitle.includes(normalizedTerm) || podcastAuthor.includes(normalizedTerm);
    });
  }
}
