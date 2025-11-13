import type { PodcastDetailDTO } from '@podcasts/application/dtos/podcast/PodcastDetailDTO';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';

import { mapEpisodesToListItemDTOs } from './episodeListItemMapper';

/**
 * Maps a podcast detail domain aggregate to a detail DTO.
 * Converts episodes to lightweight list item DTOs for optimized display.
 *
 * @param detail Podcast detail domain aggregate to map.
 * @returns Detail DTO with podcast information and optimized episode list items.
 */
export const mapPodcastDetailToDTO = (detail: PodcastDetail): PodcastDetailDTO => ({
  podcast: detail.podcast,
  episodes: mapEpisodesToListItemDTOs(detail.episodes),
});
