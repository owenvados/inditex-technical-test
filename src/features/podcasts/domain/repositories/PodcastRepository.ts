import type { Podcast } from '../entities/Podcast';

/**
 * Port (interface) that defines the contract for retrieving podcasts.
 * Implementations must live in the infrastructure layer.
 */
export interface IPodcastRepository {
  /**
   * Retrieves the list of top podcasts defined by the business rules.
   */
  getTopPodcasts(): Promise<Podcast[]>;
}
