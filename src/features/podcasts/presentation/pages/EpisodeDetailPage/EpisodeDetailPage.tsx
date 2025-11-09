import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { AudioPlayer } from '@shared/presentation/components/AudioPlayer';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import './EpisodeDetailPage.css';

/**
 * Detail page for a single episode, providing contextual navigation and metadata.
 */
export const EpisodeDetailPage: React.FC = () => {
  const { podcastId, episodeId } = useParams();
  const { podcastDetail, isLoading, error } = usePodcastDetail(podcastId);

  if (isLoading) {
    return (
      <section
        className="episode-detail-page episode-detail-page--loading"
        data-testid="episode-detail-loading"
      >
        <p>Loading episode…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="episode-detail-page episode-detail-page--error"
        data-testid="episode-detail-error"
      >
        <p>{error}</p>
      </section>
    );
  }

  if (!podcastDetail) {
    return (
      <section
        className="episode-detail-page episode-detail-page--empty"
        data-testid="episode-detail-empty"
      >
        <p>Podcast not found.</p>
      </section>
    );
  }

  const episode = podcastDetail.episodes.find((item) => item.id === episodeId);

  if (!episode) {
    return (
      <section
        className="episode-detail-page episode-detail-page--empty"
        data-testid="episode-detail-missing"
      >
        <p>Episode not found.</p>
        <Link to={`/podcast/${podcastDetail.podcast.id}`}>Back to podcast detail</Link>
      </section>
    );
  }

  return (
    <section className="episode-detail-page" data-testid="episode-detail-page">
      <PodcastSidebar podcast={podcastDetail.podcast} linkToPodcast />

      <main className="episode-detail-page__main">
        <article className="episode-detail">
          <h1 className="episode-detail__title">{episode.title}</h1>
          <div
            className="episode-detail__description"
            dangerouslySetInnerHTML={{ __html: episode.description }}
          />
          {episode.audioUrl && (
            <AudioPlayer
              src={episode.audioUrl}
              className="episode-detail__audio"
              dataTestId="episode-audio"
            />
          )}
        </article>
      </main>
    </section>
  );
};

EpisodeDetailPage.displayName = 'EpisodeDetailPage';

export default EpisodeDetailPage;
