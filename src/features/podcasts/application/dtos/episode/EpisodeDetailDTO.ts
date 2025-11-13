import type { Duration } from '@podcasts/domain/models/episode/Duration';

/**
 * Data Transfer Object for episode detail display.
 * Contains all fields needed for the episode detail view.
 *
 * This DTO is used when displaying a single episode's full information,
 * including the HTML description and audio URL for playback.
 */
export interface EpisodeDetailDTO {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  publishedAt: Date;
  duration: Duration;
}
