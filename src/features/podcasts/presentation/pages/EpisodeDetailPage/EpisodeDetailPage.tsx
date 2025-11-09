import React from 'react';
import { Link, useParams } from 'react-router-dom';

import './EpisodeDetailPage.css';

/**
 * Detail page for a single episode, providing contextual navigation and metadata placeholder.
 */
export const EpisodeDetailPage: React.FC = () => {
  const { podcastId, episodeId } = useParams();

  return (
    <section className="episode-detail-page">
      <h1 className="episode-detail-page__heading">Episode Detail</h1>
      <p className="episode-detail-page__description">
        Displaying episode {episodeId} associated with podcast {podcastId}.
      </p>
      <Link to={`/podcast/${podcastId}`}>Back to podcast detail</Link>
    </section>
  );
};

EpisodeDetailPage.displayName = 'EpisodeDetailPage';

export default EpisodeDetailPage;
