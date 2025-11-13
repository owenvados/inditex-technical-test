import type { Podcast } from '../entities/Podcast';
import type { PodcastDetail } from '../entities/PodcastDetail';

/**
 * Repository port that defines the contract for accessing podcast data.
 * This interface is implemented in the infrastructure layer by adapters
 * that connect to external data sources like APIs or databases.
 */
export interface IPodcastRepository {
  /**
   * Fetches the top podcasts from the data source.
   * Returns the list of podcasts ordered by popularity or ranking.
   *
   * @returns Promise that resolves to an array of podcast entities.
   */
  getTopPodcasts(): Promise<Podcast[]>;

  /**
   * Fetches detailed information about a specific podcast including its episodes.
   *
   * @param podcastId Unique identifier of the podcast to retrieve.
   * @returns Promise that resolves to a podcast detail aggregate with episodes.
   */
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}
