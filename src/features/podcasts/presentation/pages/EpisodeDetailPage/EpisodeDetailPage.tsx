import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { AudioPlayer } from '@shared/presentation/components/AudioPlayer';
import React from 'react';
import { useParams } from 'react-router-dom';

import './EpisodeDetailPage.css';

/**
 * Page component that displays detailed information about a specific podcast episode.
 * Shows episode title, description, and audio player.
 * Includes a sidebar with podcast information that links back to the podcast detail page.
 * Returns null while loading or if the episode is not found.
 *
 * @returns Page component with episode details and audio player, or null if not found.
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
