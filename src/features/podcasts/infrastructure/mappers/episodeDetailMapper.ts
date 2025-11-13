import type { EpisodeDetailDTO } from '@podcasts/application/dtos/episode/EpisodeDetailDTO';
import { Duration } from '@podcasts/domain/models/episode/Duration';
import type { Episode } from '@podcasts/domain/models/episode/Episode';

/**
 * Maps a domain Episode entity to an EpisodeDetailDTO.
 * Includes all fields needed for the episode detail view.
 *
 * @param episode Domain entity representing an episode.
 * @returns DTO containing all fields needed for detail display.
 */
export const mapEpisodeToDetailDTO = (episode: Episode): EpisodeDetailDTO => {
  // Ensure duration is always a Duration object, fallback to zero Duration if missing or invalid
  const duration = episode.duration instanceof Duration ? episode.duration : new Duration(0);

  return {
    id: episode.id,
    title: episode.title,
    description: episode.description,
    audioUrl: episode.audioUrl,
    publishedAt: episode.publishedAt,
    duration,
  };
};
