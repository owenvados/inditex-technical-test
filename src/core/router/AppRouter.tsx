import { EpisodeDetailPage } from '@podcasts/presentation/pages/EpisodeDetailPage';
import { PodcastDetailPage } from '@podcasts/presentation/pages/PodcastDetailPage';
import { PodcastsPage } from '@podcasts/presentation/pages/PodcastsPage';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

/**
 * Central routing component mapping URL paths to feature presentation pages.
 *
 * @returns {JSX.Element} The route configuration rendered within React Router.
 */
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PodcastsPage />} />
      <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
      <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetailPage />} />
    </Routes>
  );
};

export default AppRouter;
