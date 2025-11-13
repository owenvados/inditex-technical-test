import { buildEpisodeDetailRoute } from '@core/router/routes';
import type { Episode } from '@podcasts/domain/entities/Episode';
import type { ListTableColumn } from '@shared/presentation/components/ListTable';
import { formatShortDate } from '@shared/utils/formatters';
import { Link } from 'react-router-dom';

/**
 * Creates the column configuration for the episode list table.
 * Defines columns for title, publication date, and duration.
 * Title column includes navigation links to episode detail pages.
 *
 * @param podcastId Unique identifier of the podcast used to build episode navigation links.
 * @returns Array of column definitions for the episode list table.
 */
export const createEpisodeListColumns = (podcastId: string): Array<ListTableColumn<Episode>> => [
  {
    header: 'Title',
    cellClassName: 'episode-title-cell',
    cell: (episode) => (
      <Link to={buildEpisodeDetailRoute(podcastId, episode.id)} className="episode-title-link">
        {episode.title}
      </Link>
    ),
  },
  {
    header: 'Date',
    cellClassName: 'episode-date',
    cell: (episode) => formatShortDate(episode.publishedAt),
  },
  {
    header: 'Duration',
    cellClassName: 'episode-duration',
    cell: (episode) => episode.duration.format(),
  },
];
