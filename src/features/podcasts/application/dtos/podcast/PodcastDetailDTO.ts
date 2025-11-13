import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';

import type { EpisodeListItemDTO } from '../episode/EpisodeListItemDTO';

/**
 * Data Transfer Object for podcast detail display with episode list.
 * Contains the podcast entity (used in sidebar) and episode list items (optimized for list view).
 *
 * This DTO optimizes memory usage by using EpisodeListItemDTO for the episode list,
 * which excludes heavy fields like description and audioUrl that are not needed in the list view.
 */
export interface PodcastDetailDTO {
  podcast: Podcast;
  episodes: EpisodeListItemDTO[];
}
