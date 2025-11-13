import { buildPodcastDetailRoute } from '@core/router/routes';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import './PodcastCard.css';

export interface PodcastCardProps {
  podcast: Podcast;
}

/**
 * Memoized component that displays a podcast card with navigation to the detail page.
 * Shows podcast artwork, title, and author information in a clickable card format.
 *
 * @param props Component props containing the podcast data to display.
 * @returns Clickable card component that navigates to the podcast detail page.
 */
export const PodcastCard = memo(({ podcast }: PodcastCardProps) => {
  return (
    <Link
      to={buildPodcastDetailRoute(podcast.id)}
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
