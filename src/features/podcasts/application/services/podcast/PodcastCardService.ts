import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';
import { mapPodcastsToCardDTOs } from '@podcasts/infrastructure/mappers/podcastCardMapper';

import type { PodcastCardDTO } from '../../dtos/podcast/PodcastCardDTO';

/**
 * Application service responsible for converting podcast entities to DTOs.
 * This service acts as an adapter between the domain layer and the presentation layer,
 * converting domain entities to DTOs optimized for the UI.
 *
 * Note: This service does NOT fetch data or handle caching.
 * It only converts entities to DTOs. Data fetching and caching should be handled
 * by use cases and hooks.
 */
export class PodcastCardService {
  /**
   * Converts podcast entities to card DTOs.
   * This method returns only the fields needed for the podcast list view,
   * reducing memory footprint by excluding the `summary` field.
   *
   * @param podcasts Array of podcast entities to convert.
   * @returns Array of podcast card DTOs optimized for list display.
   */
  mapToCardDTOs(podcasts: Podcast[]): PodcastCardDTO[] {
    return mapPodcastsToCardDTOs(podcasts);
  }
}
