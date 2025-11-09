/* eslint-disable react/prop-types */
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import StatusMessage from '@shared/presentation/components/StatusMessage';

import PodcastCard from '../PodcastCard';
import './PodcastList.css';

export interface PodcastListProps {
  podcasts: Podcast[];
}

/**
 * Grid that displays a collection of podcasts.
 *
 * @param props - List of podcasts to render.
 * @returns A responsive grid of podcast cards or an empty placeholder.
 */
export const PodcastList: React.FC<PodcastListProps> = ({ podcasts }) => {
  if (podcasts.length === 0) {
    return <StatusMessage message="No podcasts found" dataTestId="podcast-list-empty" />;
  }

  return (
    <div className="podcast-grid" data-testid="podcast-list">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};

PodcastList.displayName = 'PodcastList';

export default PodcastList;
