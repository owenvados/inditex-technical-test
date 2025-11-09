import type { Episode } from '@podcasts/domain/entities/Episode';
import ListTable, { type ListTableColumn } from '@shared/presentation/components/ListTable';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import { formatDurationMs, formatShortDate } from '@shared/utils/formatters';
import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import './EpisodeList.css';

export interface EpisodeListProps {
  episodes: Episode[];
  podcastId: string;
}

/**
 * Renders the episodes catalogue for a podcast including navigation to each episode detail.
 *
 * @param props Component configuration combining the dataset and podcast identifier.
 * @returns Table element or an empty placeholder when the list is empty.
 */
const EpisodeListComponent: React.FC<EpisodeListProps> = ({ episodes, podcastId }) => {
  const columns: Array<ListTableColumn<Episode>> = useMemo(
    () => [
      {
        header: 'Title',
        cellClassName: 'episode-title-cell',
        cell: (episode) => (
          <Link to={`/podcast/${podcastId}/episode/${episode.id}`} className="episode-title-link">
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
    ],
    [podcastId],
  );

  return (
    <ListTable
      data={episodes}
      columns={columns}
      getRowKey={(episode) => episode.id}
      className="episode-list"
      tableTestId="episode-list"
      emptyState={
        <StatusMessage message="No episodes available" dataTestId="episode-empty-state" />
      }
    />
  );
};

EpisodeListComponent.displayName = 'EpisodeList';

export const EpisodeList = memo(EpisodeListComponent);

export default EpisodeList;
