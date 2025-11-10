/**
 * Entity representing an individual podcast episode.
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
