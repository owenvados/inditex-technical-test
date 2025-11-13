import type { Episode } from '../episode/Episode';
import type { Podcast } from '../podcast/Podcast';

/**
 * Aggregate describing a podcast along with its episodes catalogue.
 */
export interface PodcastDetail {
  podcast: Podcast;
  episodes: Episode[];
}
