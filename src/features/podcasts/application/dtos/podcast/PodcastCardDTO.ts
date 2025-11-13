/**
 * Data transfer object representing a podcast card optimized for list display.
 * Contains only the fields required for displaying a podcast card in a list,
 * excluding the summary field to reduce memory usage.
 */
export interface PodcastCardDTO {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}
