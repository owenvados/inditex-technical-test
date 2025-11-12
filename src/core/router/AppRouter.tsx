import { ROUTE_PATHS } from '@core/router/routes';
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
      <Route path={ROUTE_PATHS.home} element={<PodcastsPage />} />
      <Route path={ROUTE_PATHS.podcastDetail} element={<PodcastDetailPage />} />
      <Route path={ROUTE_PATHS.episodeDetail} element={<EpisodeDetailPage />} />
    </Routes>
  );
};

export default AppRouter;
