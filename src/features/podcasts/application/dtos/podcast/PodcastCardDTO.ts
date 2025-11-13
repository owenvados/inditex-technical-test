/**
 * Data Transfer Object for podcast card display.
 * Contains only the fields needed for the podcast list view.
 *
 * This DTO reduces memory footprint by excluding the `summary` field,
 * which is not used in the list view but is present in the domain entity.
 */
export interface PodcastCardDTO {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
}
