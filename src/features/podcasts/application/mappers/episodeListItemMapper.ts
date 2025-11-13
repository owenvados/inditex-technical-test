import type { EpisodeListItemDTO } from '@podcasts/application/dtos/podcast/EpisodeListItemDTO';
import type { Episode } from '@podcasts/domain/entities/Episode';

/**
 * Maps an episode domain entity to a list item DTO.
 * Extracts only the fields required for displaying an episode in a list,
 * excluding heavy fields like description and audio URL.
 *
 * @param episode Episode domain entity to map.
 * @returns List item DTO containing only the fields needed for list display.
 */
export const mapEpisodeToListItemDTO = (episode: Episode): EpisodeListItemDTO => ({
  id: episode.id,
  title: episode.title,
  publishedAt: episode.publishedAt,
  durationMs: episode.duration.toMilliseconds(),
});

/**
 * Maps an array of episode domain entities to list item DTOs.
 * Processes each episode entity through the single entity mapper.
 *
 * @param episodes Array of episode domain entities to map.
 * @returns Array of list item DTOs ready for list display.
 */
export const mapEpisodesToListItemDTOs = (episodes: Episode[]): EpisodeListItemDTO[] =>
  episodes.map(mapEpisodeToListItemDTO);
