import type { PodcastDetail } from '../models/aggregate/PodcastDetail';
import type { Podcast } from '../models/podcast/Podcast';

/**
 * Port (interface) that defines the contract for retrieving podcasts.
 * Implementations must live in the infrastructure layer.
 */
export interface IPodcastRepository {
  /**
   * Retrieves the list of top podcasts defined by the business rules.
   */
  getTopPodcasts(): Promise<Podcast[]>;

  /**
   * Retrieves a podcast detail including its episodes.
   *
   * @param podcastId Identifier of the podcast to fetch.
   */
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}
