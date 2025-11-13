import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';

/**
 * Use case that orchestrates the retrieval of a podcast detail with its episodes.
 * Ensures that episodes are sorted by publication date in descending order.
 */
export class GetPodcastDetail {
  /**
   * Creates an instance of the GetPodcastDetail use case.
   *
   * @param repository Repository implementation that provides access to podcast data.
   */
  constructor(private readonly repository: IPodcastRepository) {}

  /**
   * Fetches detailed information about a podcast including all its episodes.
   * Episodes are sorted by publication date with the most recent first.
   * Throws an error if the podcast ID is empty or invalid.
   *
   * @param podcastId Unique identifier of the podcast to retrieve.
   * @returns Promise that resolves to a podcast detail aggregate with sorted episodes.
   * @throws Error if the podcast ID is empty or invalid.
   */
  async execute(podcastId: string): Promise<PodcastDetail> {
    if (!podcastId || podcastId.trim() === '') {
      throw new Error('Podcast ID is required');
    }

    const detail = await this.repository.getPodcastDetail(podcastId);
    const episodes = [...detail.episodes].sort(
      (first, second) => second.publishedAt.getTime() - first.publishedAt.getTime(),
    );

    return {
      ...detail,
      episodes,
    };
  }
}
