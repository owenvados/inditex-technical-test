import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';
import type { Podcast } from '@podcasts/domain/entities/Podcast';

/**
 * Maps a podcast domain entity to a card DTO.
 * Extracts only the fields required for displaying a podcast card in a list.
 *
 * @param podcast Podcast domain entity to map.
 * @returns Card DTO containing only the fields needed for card display.
 */
export const mapPodcastToCardDTO = (podcast: Podcast): PodcastCardDTO => ({
  id: podcast.id,
  imageUrl: podcast.imageUrl,
  title: podcast.title,
  author: podcast.author,
});

/**
 * Maps an array of podcast domain entities to card DTOs.
 * Processes each podcast entity through the single entity mapper.
 *
 * @param podcasts Array of podcast domain entities to map.
 * @returns Array of card DTOs ready for list display.
 */
export const mapPodcastsToCardDTOs = (podcasts: Podcast[]): PodcastCardDTO[] =>
  podcasts.map(mapPodcastToCardDTO);
