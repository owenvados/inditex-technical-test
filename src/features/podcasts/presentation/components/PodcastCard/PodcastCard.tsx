import { buildPodcastDetailRoute } from '@core/router/routes';
import type { PodcastCardDTO } from '@podcasts/application/dtos/podcast/PodcastCardDTO';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import './PodcastCard.css';

export interface PodcastCardProps {
  podcast: PodcastCardDTO;
}

/**
 * Memoized summary card linking to the podcast detail view.
 *
 * @param props Attributes describing the podcast to render.
 * @returns Interactive card with artwork, title and author information.
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
