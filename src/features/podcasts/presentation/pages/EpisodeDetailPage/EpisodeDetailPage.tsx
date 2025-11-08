import React from 'react';
import { Link, useParams } from 'react-router-dom';

/**
 * Detail page for a single episode, providing contextual navigation and metadata placeholder.
 *
 * @returns {JSX.Element} The episode detail placeholder section.
 */
export const EpisodeDetailPage: React.FC = () => {
  const { podcastId, episodeId } = useParams();

  return (
    <section style={{ padding: '2rem' }}>
      <h1>Episode Detail</h1>
      <p>
        Displaying episode {episodeId} associated with podcast {podcastId}.
      </p>
      <Link to={`/podcast/${podcastId}`}>Back to podcast detail</Link>
    </section>
  );
};

export default EpisodeDetailPage;
