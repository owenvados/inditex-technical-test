import type { PodcastDetail } from '@podcasts/domain/models/aggregate/PodcastDetail';
import { mapPodcastDetailToDTO } from '@podcasts/infrastructure/mappers/podcastDetailMapper';

import type { PodcastDetailDTO } from '../../dtos/podcast/PodcastDetailDTO';

/**
 * Application service responsible for converting podcast detail entities to DTOs.
 * This service acts as an adapter between the domain layer and the presentation layer,
 * converting domain entities to DTOs optimized for the UI.
 *
 * Note: This service does NOT fetch data or handle caching.
 * It only converts entities to DTOs. Data fetching and caching should be handled
 * by use cases and hooks.
 */
export class PodcastDetailService {
  /**
   * Converts podcast detail entity to a DTO with optimized episode list items.
   * This method returns PodcastDetailDTO with EpisodeListItemDTOs for the list view,
   * reducing memory footprint by excluding heavy fields like description and audioUrl.
   *
   * @param detail Podcast detail entity to convert.
   * @returns Podcast detail DTO with optimized episode list items.
   */
  mapToDetailDTO(detail: PodcastDetail): PodcastDetailDTO {
    return mapPodcastDetailToDTO(detail);
  }
}
