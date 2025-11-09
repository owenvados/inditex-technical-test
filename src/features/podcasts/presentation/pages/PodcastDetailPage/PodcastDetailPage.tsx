import React from 'react';
import { Link, useParams } from 'react-router-dom';

import './PodcastDetailPage.css';

/**
 * Detail page for a specific podcast showing high level information and navigation.
 *
 * @returns {JSX.Element} The podcast detail placeholder section.
 */
export const PodcastDetailPage: React.FC = () => {
  const { podcastId } = useParams();

  return (
    <section className="podcast-detail-page">
      <h1 className="podcast-detail-page__heading">Podcast Detail</h1>
      <p className="podcast-detail-page__description">
        Displaying information for podcast {podcastId}.
      </p>
      <Link to="/">Back to podcasts</Link>
    </section>
  );
};

PodcastDetailPage.displayName = 'PodcastDetailPage';

export default PodcastDetailPage;
