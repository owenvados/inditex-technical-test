import { buildPodcastDetailRoute } from '@core/router/routes';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { Sidebar } from '@shared/presentation/components/Sidebar';
import React from 'react';
import { Link } from 'react-router-dom';

import './PodcastSidebar.css';

export interface PodcastSidebarProps {
  podcast: Podcast;
  linkTo?: string;
}

/**
 * Static sidebar showcasing the podcast artwork and metadata.
 *
 * @param props Podcast information to display.
 * @returns Sidebar element containing image, title, author and description.
 */
export const PodcastSidebar: React.FC<PodcastSidebarProps> = ({ podcast, linkTo }) => {
  const target = linkTo ?? buildPodcastDetailRoute(podcast.id);

  return (
    <Link to={target} className="podcast-sidebar__link" data-testid="podcast-sidebar-link">
      <Sidebar>
        <img src={podcast.imageUrl} alt={podcast.title} className="podcast-sidebar__image" />
        <div className="podcast-sidebar__info">
          <h3 className="podcast-sidebar__title">{podcast.title}</h3>
          <p className="podcast-sidebar__author">by {podcast.author}</p>
        </div>
        <div className="podcast-sidebar__description">
          <h4>Description</h4>
          <p>{podcast.summary}</p>
        </div>
      </Sidebar>
    </Link>
  );
};

PodcastSidebar.displayName = 'PodcastSidebar';

export default PodcastSidebar;
