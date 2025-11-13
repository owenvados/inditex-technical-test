import { buildHomeRoute } from '@core/router/routes';
import { EpisodeList } from '@podcasts/presentation/components/EpisodeList';
import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import React from 'react';
import { useParams } from 'react-router-dom';

import './PodcastDetailPage.css';

/**
 * Page component that displays detailed information about a specific podcast.
 * Shows podcast metadata in a sidebar and a list of episodes in the main content area.
 * Returns null while loading or if the podcast is not found.
 *
 * @returns Page component with podcast details and episode list, or null if not found.
 */
export const PodcastDetailPage: React.FC = () => {
  const { podcastId } = useParams();
  const { podcastDetail, isLoading } = usePodcastDetail(podcastId);

  if (isLoading || !podcastDetail) {
    return null;
  }

  const { podcast, episodes } = podcastDetail;

  return (
    <section className="podcast-detail-page" data-testid="podcast-detail-page">
      <PodcastSidebar podcast={podcast} linkTo={buildHomeRoute()} />
      <main className="podcast-detail-page__main">
        <header className="podcast-detail-page__header">
          <h2>Episodes: {episodes.length}</h2>
        </header>

        <EpisodeList episodes={episodes} podcastId={podcast.id} />
      </main>
    </section>
  );
};

PodcastDetailPage.displayName = 'PodcastDetailPage';

export default PodcastDetailPage;
