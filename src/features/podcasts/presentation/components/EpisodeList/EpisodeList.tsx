import type { Episode } from '@podcasts/domain/entities/Episode';
import ListTable from '@shared/presentation/components/ListTable';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import React, { memo, useMemo } from 'react';

import { createEpisodeListColumns } from './episodeListColumns';

import './EpisodeList.css';

export interface EpisodeListProps {
  episodes: Episode[];
  podcastId: string;
}

/**
 * Component that displays a list of podcast episodes in a table format.
 * Shows episode title, publication date, and duration with navigation to episode details.
 * Displays an empty state message when no episodes are available.
 *
 * @param props Component props containing episodes data and podcast identifier.
 * @returns Table component with episode list or empty state message.
 */
const EpisodeListComponent: React.FC<EpisodeListProps> = ({ episodes, podcastId }) => {
  const columns = useMemo(() => createEpisodeListColumns(podcastId), [podcastId]);

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
