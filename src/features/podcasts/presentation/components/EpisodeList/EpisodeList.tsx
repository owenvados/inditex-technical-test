import type { Episode } from '@podcasts/domain/entities/Episode';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import './EpisodeList.css';

export interface EpisodeListProps {
  episodes: Episode[];
  podcastId: string;
}

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const formatDuration = (durationMs: number): string => {
  if (!durationMs || Number.isNaN(durationMs)) {
    return '--:--';
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
};

const EpisodeListComponent: React.FC<EpisodeListProps> = ({ episodes, podcastId }) => {
  const rows = useMemo(() => {
    if (episodes.length === 0) {
      return null;
    }

    return episodes.map((episode) => (
      <tr key={episode.id} className="episode-row">
        <td className="episode-title-cell">
          <Link to={`/podcast/${podcastId}/episode/${episode.id}`} className="episode-title-link">
            {episode.title}
          </Link>
        </td>
        <td className="episode-date">{formatDate(episode.publishedAt)}</td>
        <td className="episode-duration">{formatDuration(episode.durationMs)}</td>
      </tr>
    ));
  }, [episodes, podcastId]);

  if (!rows) {
    return <StatusMessage message="No episodes available" dataTestId="episode-empty-state" />;
  }

  return (
    <div className="episode-list" data-testid="episode-list">
      <table className="episode-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

EpisodeListComponent.displayName = 'EpisodeList';

export const EpisodeList = memo(EpisodeListComponent);

export default EpisodeList;
