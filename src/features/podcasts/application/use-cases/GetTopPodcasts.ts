import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';

/**
 * Use case that orchestrates the retrieval of the top podcasts catalogue.
 * Coordinates the data fetching process through the repository interface.
 */
export class GetTopPodcasts {
  /**
   * Creates an instance of the GetTopPodcasts use case.
   *
   * @param repository Repository implementation that provides access to podcast data.
   */
  constructor(private readonly repository: IPodcastRepository) {}

  /**
   * Fetches the top podcasts from the repository.
   * Returns the list of podcasts in the order provided by the data source.
   *
   * @returns Promise that resolves to an array of podcast entities.
   */
  async execute(): Promise<Podcast[]> {
    return this.repository.getTopPodcasts();
  }
}
