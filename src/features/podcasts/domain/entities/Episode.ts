/**
 * Domain entity representing a single podcast episode.
 * Contains all the information needed to display and play an episode.
 */
export interface Episode {
  id: string;
  title: string;
  description: string;
  guid?: string;
  audioUrl: string;
  publishedAt: Date;
  durationMs: number;
}
