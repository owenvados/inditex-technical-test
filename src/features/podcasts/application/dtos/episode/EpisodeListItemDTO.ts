import type { Duration } from '@podcasts/domain/models/episode/Duration';

/**
 * Data Transfer Object for episode list item display.
 * Contains only the fields needed for the episode list table view.
 *
 * This DTO reduces memory footprint by excluding the `description` and `audioUrl` fields,
 * which are not used in the list view but are present in the domain entity.
 *
 * Benefits:
 * - Reduces memory usage when displaying lists of up to 20 episodes
 * - Excludes HTML description content (can be >1KB per episode)
 * - Optimizes data transfer between application and presentation layers
 */
export interface EpisodeListItemDTO {
  id: string;
  title: string;
  publishedAt: Date;
  duration: Duration;
}
