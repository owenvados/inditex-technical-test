import { buildEpisodeDetailRoute } from '@core/router/routes';
import type { Episode } from '@podcasts/domain/entities/Episode';
import type { ListTableColumn } from '@shared/presentation/components/ListTable';
import { formatDurationMs, formatShortDate } from '@shared/utils/formatters';
import { Link } from 'react-router-dom';

/**
 * Builds the columns configuration for the episode list table.
 *
 * @param podcastId Podcast identifier used to compose navigation links.
 * @returns Column definition array consumed by `ListTable`.
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
    cell: (episode) => formatDurationMs(episode.durationMs),
  },
];
