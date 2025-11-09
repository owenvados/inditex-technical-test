import type { Podcast } from '@podcasts/domain/entities/Podcast';

import PodcastCard from '../PodcastCard';
import './PodcastList.css';

export interface PodcastListProps {
  podcasts: Podcast[];
}

/**
 * Grid that displays a collection of podcasts.
 *
 * @param {PodcastListProps} props - List of podcasts to render.
 * @returns {JSX.Element} A responsive grid of podcast cards or an empty placeholder.
 */
export const PodcastList: React.FC<PodcastListProps> = ({ podcasts }: PodcastListProps) => {
  if (podcasts.length === 0) {
    return <div className="empty-state">No podcasts found</div>;
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
