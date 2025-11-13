import type { Podcast } from '@podcasts/domain/entities/Podcast';

import type { PodcastCardDTO } from '../../dtos/podcast/PodcastCardDTO';
import { mapPodcastsToCardDTOs } from '../../mappers/podcastCardMapper';

/**
 * Application service that converts podcast domain entities to DTOs.
 * Acts as an adapter between the domain layer and the presentation layer,
 * creating DTOs optimized for UI display by excluding unnecessary fields.
 *
 * This service only performs data transformation and does not handle
 * data fetching or caching operations.
 */
export class PodcastCardService {
  /**
   * Converts podcast domain entities to card DTOs.
   * Returns only the fields required for the podcast list view,
   * excluding the summary field to reduce memory usage.
   *
   * @param podcasts Array of podcast domain entities to convert.
   * @returns Array of podcast card DTOs optimized for list display.
   */
  mapToCardDTOs(podcasts: Podcast[]): PodcastCardDTO[] {
    return mapPodcastsToCardDTOs(podcasts);
  }
}
