import type { Podcast } from '@podcasts/domain/entities/Podcast';

/**
 * Data transfer object representing a podcast card optimized for list display.
 * Contains only the fields required for displaying a podcast card in a list,
 * excluding the summary field to reduce memory usage.
 *
 * Derived from Podcast entity using Pick to select only necessary fields.
 */
export type PodcastCardDTO = Pick<Podcast, 'id' | 'title' | 'author' | 'imageUrl'>;
