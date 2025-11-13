import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';
import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';

/**
 * Maps a domain Podcast entity to a PodcastCardDTO.
 * Extracts only the fields needed for the card view.
 *
 * @param podcast Domain entity representing a podcast.
 * @returns DTO containing only the fields needed for the card display.
 */
export const mapPodcastToCardDTO = (podcast: Podcast): PodcastCardDTO => ({
  id: podcast.id,
  imageUrl: podcast.imageUrl,
  title: podcast.title,
  author: podcast.author,
});

export const mapPodcastsToCardDTOs = (podcasts: Podcast[]): PodcastCardDTO[] =>
  podcasts.map(mapPodcastToCardDTO);
