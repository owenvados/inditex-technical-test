import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';

/**
 * Use case responsible for orchestrating the retrieval of the top podcasts catalogue.
 */
export class GetTopPodcasts {
  /**
   * @param repository Podcast repository implementation used to fetch data.
   */
  constructor(private readonly repository: IPodcastRepository) {}

  /**
   * Executes the use case and returns the list of podcasts provided by the repository.
   */
  async execute(): Promise<Podcast[]> {
    return this.repository.getTopPodcasts();
  }
}
