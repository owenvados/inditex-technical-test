import { EpisodeList } from '@podcasts/presentation/components/EpisodeList';
import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import React from 'react';
import { useParams } from 'react-router-dom';

import './PodcastDetailPage.css';

/**
 * Detail page presenting podcast metadata and its episodes catalogue.
 */
export const PodcastDetailPage: React.FC = () => {
  const { podcastId } = useParams();
  const { podcastDetail, isLoading, error } = usePodcastDetail(podcastId);

  if (isLoading) {
    return (
      <section
        className="podcast-detail-page podcast-detail-page--loading"
        data-testid="podcast-detail-loading"
      >
        <p>Loading podcast detail…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="podcast-detail-page podcast-detail-page--error"
        data-testid="podcast-detail-error"
      >
        <p>{error}</p>
      </section>
    );
  }

  if (!podcastDetail) {
    return (
      <section
        className="podcast-detail-page podcast-detail-page--empty"
        data-testid="podcast-detail-empty"
      >
        <p>Podcast not found.</p>
      </section>
    );
  }

  const { podcast, episodes } = podcastDetail;

  return (
    <section className="podcast-detail-page" data-testid="podcast-detail-page">
      <PodcastSidebar podcast={podcast} />

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
