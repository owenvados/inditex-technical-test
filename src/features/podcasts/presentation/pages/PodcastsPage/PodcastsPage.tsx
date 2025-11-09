import PodcastList from '@podcasts/presentation/components/PodcastList';
import { useTopPodcasts } from '@podcasts/presentation/hooks/useTopPodcasts';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import React from 'react';

import './PodcastsPage.css';

/**
 * Page that lists the top podcasts using the catalogue hook.
 *
 * @returns Section showing a loading placeholder or the podcast grid.
 */
export const PodcastsPage: React.FC = () => {
  const { podcasts, isLoading } = useTopPodcasts();

  return (
    <section className="podcasts-page">
      {isLoading ? (
        <StatusMessage message="Loading podcasts…" dataTestId="podcast-loading" />
      ) : (
        <PodcastList podcasts={podcasts} />
      )}
    </section>
  );
};

PodcastsPage.displayName = 'PodcastsPage';

export default PodcastsPage;
