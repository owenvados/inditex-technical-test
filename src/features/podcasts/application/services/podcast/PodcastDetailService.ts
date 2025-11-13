import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';

import type { PodcastDetailDTO } from '../../dtos/podcast/PodcastDetailDTO';
import { mapPodcastDetailToDTO } from '../../mappers/podcastDetailMapper';

/**
 * Application service that converts podcast detail domain entities to DTOs.
 * Acts as an adapter between the domain layer and the presentation layer,
 * creating DTOs optimized for UI display with lightweight episode list items.
 *
 * This service only performs data transformation and does not handle
 * data fetching or caching operations.
 */
export class PodcastDetailService {
  /**
   * Converts a podcast detail domain entity to a DTO.
   * Episodes are converted to lightweight list item DTOs that exclude
   * heavy fields like description and audio URL to reduce memory usage.
   *
   * @param detail Podcast detail domain entity to convert.
   * @returns Podcast detail DTO with optimized episode list items.
   */
  mapToDetailDTO(detail: PodcastDetail): PodcastDetailDTO {
    return mapPodcastDetailToDTO(detail);
  }
}
