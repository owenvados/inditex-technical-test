import type { Episode } from './Episode';
import type { Podcast } from './Podcast';

/**
 * Aggregate describing a podcast along with its episodes catalogue.
 */
export interface PodcastDetail {
  podcast: Podcast;
  episodes: Episode[];
}
