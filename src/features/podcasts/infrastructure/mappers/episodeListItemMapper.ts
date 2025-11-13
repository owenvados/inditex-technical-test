import type { EpisodeListItemDTO } from '@podcasts/application/dtos/episode/EpisodeListItemDTO';
import { Duration } from '@podcasts/domain/models/episode/Duration';
import type { Episode } from '@podcasts/domain/models/episode/Episode';

/**
 * Maps a domain Episode entity to an EpisodeListItemDTO.
 * Extracts only the fields needed for the list table view.
 *
 * @param episode Domain entity representing an episode.
 * @returns DTO containing only the fields needed for list display.
 */
export const mapEpisodeToListItemDTO = (episode: Episode): EpisodeListItemDTO => {
  // Ensure duration is always a Duration object, fallback to zero Duration if missing or invalid
  const duration = episode.duration instanceof Duration ? episode.duration : new Duration(0);

  return {
    id: episode.id,
    title: episode.title,
    publishedAt: episode.publishedAt,
    duration,
  };
};

export const mapEpisodesToListItemDTOs = (episodes: Episode[]): EpisodeListItemDTO[] =>
  episodes.map(mapEpisodeToListItemDTO);
