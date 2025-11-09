import type { Podcast } from '@podcasts/domain/entities/Podcast';
import { Sidebar } from '@shared/presentation/components/Sidebar';
import React from 'react';
import { Link } from 'react-router-dom';

import './PodcastSidebar.css';

export interface PodcastSidebarProps {
  podcast: Podcast;
  linkToPodcast?: boolean;
}

/**
 * Podcast-specific sidebar content built on top of the shared Sidebar layout.
 */
export const PodcastSidebar: React.FC<PodcastSidebarProps> = ({ podcast, linkToPodcast }) => {
  const card = (
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
  );

  if (linkToPodcast) {
    return (
      <Link
        to={`/podcast/${podcast.id}`}
        className="podcast-sidebar__link"
        data-testid="podcast-sidebar-link"
      >
        {card}
      </Link>
    );
  }

  return card;
};

PodcastSidebar.displayName = 'PodcastSidebar';

export default PodcastSidebar;
