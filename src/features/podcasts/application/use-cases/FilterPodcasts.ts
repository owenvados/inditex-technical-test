import type { Podcast } from '@podcasts/domain/entities/Podcast';

/**
 * Filters podcasts using a case-insensitive comparison against title and author.
 */
export class FilterPodcasts {
  /**
   * Executes the filtering logic.
   *
   * @param podcasts Collection of podcasts that should be filtered.
   * @param searchTerm Keyword to match against the podcast data.
   * @returns A filtered collection of podcasts.
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
