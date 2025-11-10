import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { AudioPlayer } from '@shared/presentation/components/AudioPlayer';
import React from 'react';
import { useParams } from 'react-router-dom';

import './EpisodeDetailPage.css';

/**
 * Page that presents the details for a single episode within a podcast.
 *
 * @returns Section showing loading, fallback or the episode content.
 */
export const EpisodeDetailPage: React.FC = () => {
  const { podcastId, episodeId } = useParams();
  const { podcastDetail, isLoading } = usePodcastDetail(podcastId);

  if (isLoading || !podcastDetail) {
    return null;
  }

  const episode = podcastDetail.episodes.find((item) => item.id === episodeId);

  if (!episode) {
    return null;
  }

  return (
    <section className="episode-detail-page" data-testid="episode-detail-page">
      <PodcastSidebar podcast={podcastDetail.podcast} />

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
