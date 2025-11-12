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
 * Renders the episodes catalogue for a podcast including navigation to each episode detail.
 *
 * @param props Component configuration combining the dataset and podcast identifier.
 * @returns Table element or an empty placeholder when the list is empty.
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
