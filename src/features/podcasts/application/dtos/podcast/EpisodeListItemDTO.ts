import type { Episode } from '@podcasts/domain/entities/Episode';

/**
 * Data transfer object representing an episode list item optimized for list display.
 * Contains only the fields required for displaying an episode in a list,
 * excluding heavy fields like description and audio URL to reduce memory usage.
 *
 * Note: duration is converted to milliseconds for the DTO to maintain compatibility
 * with presentation layer that may need the raw number value.
 */
export interface EpisodeListItemDTO {
  id: Episode['id'];
  title: Episode['title'];
  publishedAt: Episode['publishedAt'];
  durationMs: number;
}
