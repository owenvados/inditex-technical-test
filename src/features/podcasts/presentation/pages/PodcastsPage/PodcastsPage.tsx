import PodcastList from '@podcasts/presentation/components/PodcastList';
import { useTopPodcasts } from '@podcasts/presentation/hooks/useTopPodcasts';
import React from 'react';

import './PodcastsPage.css';

/**
 * Entry page for the podcasts catalogue displaying the main list layout.
 * Retrieves data through the useTopPodcasts hook (container) and delegates rendering to PodcastList.
 *
 * @returns {JSX.Element} The podcasts catalogue section with loading state handling.
 */
export const PodcastsPage: React.FC = () => {
  const { podcasts, isLoading } = useTopPodcasts();

  return (
    <section className="podcasts-page">
      {isLoading && <p data-testid="podcast-loading">Loading podcasts…</p>}
      {!isLoading && <PodcastList podcasts={podcasts} />}
    </section>
  );
};

PodcastsPage.displayName = 'PodcastsPage';

export default PodcastsPage;
