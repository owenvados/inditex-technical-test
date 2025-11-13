import type { Podcast } from '@podcasts/domain/entities/Podcast';

import type { EpisodeListItemDTO } from './EpisodeListItemDTO';

/**
 * Data transfer object representing a podcast detail with optimized episode list items.
 * Contains the podcast entity and lightweight episode list items for efficient display.
 * Episode list items exclude heavy fields like description and audio URL.
 */
export interface PodcastDetailDTO {
  podcast: Podcast;
  episodes: EpisodeListItemDTO[];
}
