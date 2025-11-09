import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import './PodcastCard.css';

export interface PodcastCardProps {
  podcast: Podcast;
}

/**
 * Memoized visual representation for a single podcast entry.
 * The component is wrapped in a link to navigate to the podcast detail page.
 */
export const PodcastCard = memo(({ podcast }: PodcastCardProps) => {
  return (
    <Link
      to={`/podcast/${podcast.id}`}
      className="podcast-card__link"
      data-testid="podcast-card-link"
    >
      <article className="podcast-card" data-testid="podcast-card">
        <img src={podcast.imageUrl} alt={podcast.title} className="podcast-card__image" />
        <div className="podcast-card__content">
          <h3 className="podcast-card__title">{podcast.title}</h3>
          <p className="podcast-card__author">Author: {podcast.author}</p>
        </div>
      </article>
    </Link>
  );
});

PodcastCard.displayName = 'PodcastCard';

export default PodcastCard;
