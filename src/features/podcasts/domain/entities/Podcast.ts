/**
 * Domain entity representing a podcast in the catalogue.
 * Contains the core information needed to display and identify a podcast.
 */
export interface Podcast {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  summary: string;
}
