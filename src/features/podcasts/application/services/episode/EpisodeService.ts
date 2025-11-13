import type { EpisodeDetailDTO } from '@podcasts/application/dtos/episode/EpisodeDetailDTO';
import type { EpisodeListItemDTO } from '@podcasts/application/dtos/episode/EpisodeListItemDTO';
import type { Episode } from '@podcasts/domain/models/episode/Episode';
import { mapEpisodeToDetailDTO } from '@podcasts/infrastructure/mappers/episodeDetailMapper';
import {
  mapEpisodeToListItemDTO,
  mapEpisodesToListItemDTOs,
} from '@podcasts/infrastructure/mappers/episodeListItemMapper';

/**
 * Application service responsible for converting episode entities to DTOs.
 * This service handles episode-specific operations and conversions.
 *
 * Note: This service does NOT fetch data or handle caching.
 * It only converts entities to DTOs. Data fetching and caching should be handled
 * by use cases and hooks.
 */
export class EpisodeService {
  /**
   * Converts an episode entity to an episode detail DTO.
   * This method returns the full episode detail including description and audioUrl.
   *
   * @param episode Episode entity to convert.
   * @returns Episode detail DTO.
   */
  mapToDetailDTO(episode: Episode): EpisodeDetailDTO {
    return mapEpisodeToDetailDTO(episode);
  }

  /**
   * Converts an episode entity to an episode list item DTO.
   * This method returns only the fields needed for list display.
   *
   * @param episode Episode entity to convert.
   * @returns Episode list item DTO.
   */
  mapToListItemDTO(episode: Episode): EpisodeListItemDTO {
    return mapEpisodeToListItemDTO(episode);
  }

  /**
   * Converts an array of episode entities to episode list item DTOs.
   *
   * @param episodes Array of episode entities to convert.
   * @returns Array of episode list item DTOs.
   */
  mapToListItemDTOs(episodes: Episode[]): EpisodeListItemDTO[] {
    return mapEpisodesToListItemDTOs(episodes);
  }
}
