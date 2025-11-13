import type { Episode } from './Episode';
import type { Podcast } from './Podcast';

/**
 * Domain aggregate that combines a podcast with its associated episodes.
 * Represents the complete podcast detail view including all episodes.
 */
export interface PodcastDetail {
  podcast: Podcast;
  episodes: Episode[];
}
