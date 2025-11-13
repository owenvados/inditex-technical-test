/**
 * Data transfer object representing an episode list item optimized for list display.
 * Contains only the fields required for displaying an episode in a list,
 * excluding heavy fields like description and audio URL to reduce memory usage.
 */
export interface EpisodeListItemDTO {
  id: string;
  title: string;
  publishedAt: Date;
  durationMs: number;
}
