import type { Episode } from '@podcasts/domain/entities/Episode';

/**
 * Data transfer object representing an episode list item optimized for list display.
 * Contains only the fields required for displaying an episode in a list,
 * excluding heavy fields like description and audio URL to reduce memory usage.
 *
 * Derived from Episode entity using Pick to select only necessary fields.
 */
export type EpisodeListItemDTO = Pick<Episode, 'id' | 'title' | 'publishedAt' | 'durationMs'>;
