import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';

/**
 * Use case responsible for retrieving a podcast detail including its episodes.
 */
export class GetPodcastDetail {
  /**
   * @param repository Podcast repository used to fetch the detail.
   */
  constructor(private readonly repository: IPodcastRepository) {}

  /**
   * Executes the lookup ensuring episodes are sorted by published date (DESC).
   *
   * @param podcastId Identifier of the podcast to fetch.
   * @returns Podcast detail aggregate.
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
