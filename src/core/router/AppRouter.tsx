import { ROUTE_PATHS } from '@core/router/routes';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy load page components for code splitting
const PodcastsPage = lazy(() => import('@podcasts/presentation/pages/PodcastsPage'));
const PodcastDetailPage = lazy(() => import('@podcasts/presentation/pages/PodcastDetailPage'));
const EpisodeDetailPage = lazy(() => import('@podcasts/presentation/pages/EpisodeDetailPage'));
const NotFoundPage = lazy(() => import('@shared/presentation/pages/NotFoundPage'));

/**
 * Loading fallback component displayed while lazy-loaded routes are being fetched.
 *
 * @returns Loading message component.
 */
const RouteLoadingFallback: React.FC = () => (
  <StatusMessage message="Loading…" dataTestId="route-loading" />
);

/**
 * Central routing component mapping URL paths to feature presentation pages.
 * Uses React.lazy() for code splitting and Suspense for loading states.
 *
 * @returns {JSX.Element} The route configuration rendered within React Router.
 */
export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path={ROUTE_PATHS.home} element={<PodcastsPage />} />
        <Route path={ROUTE_PATHS.podcastDetail} element={<PodcastDetailPage />} />
        <Route path={ROUTE_PATHS.episodeDetail} element={<EpisodeDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
