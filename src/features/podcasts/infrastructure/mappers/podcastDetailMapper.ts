import type { PodcastDetailDTO } from '@podcasts/application/dtos/podcast/PodcastDetailDTO';
import type { PodcastDetail } from '@podcasts/domain/models/aggregate/PodcastDetail';

import { mapEpisodesToListItemDTOs } from './episodeListItemMapper';

/**
 * Maps a domain PodcastDetail aggregate to a PodcastDetailDTO.
 * Converts episodes to EpisodeListItemDTOs for optimized list display.
 *
 * @param detail Domain aggregate representing a podcast with episodes.
 * @returns DTO containing podcast and episode list items optimized for list view.
 */
export const mapPodcastDetailToDTO = (detail: PodcastDetail): PodcastDetailDTO => ({
  podcast: detail.podcast,
  episodes: mapEpisodesToListItemDTOs(detail.episodes),
});
