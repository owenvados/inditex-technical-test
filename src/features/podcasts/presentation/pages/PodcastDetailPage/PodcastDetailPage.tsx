import React from 'react';
import { Link, useParams } from 'react-router-dom';

/**
 * Detail page for a specific podcast showing high level information and navigation.
 * Substituted with placeholder content until data integration is complete.
 *
 * @returns {JSX.Element} The podcast detail placeholder section.
 */
export const PodcastDetailPage: React.FC = () => {
  const { podcastId } = useParams();

  return (
    <section style={{ padding: '2rem' }}>
      <h1>Podcast Detail</h1>
      <p>Displaying information for podcast {podcastId}.</p>
      <Link to="/">Back to podcasts</Link>
    </section>
  );
};

export default PodcastDetailPage;
