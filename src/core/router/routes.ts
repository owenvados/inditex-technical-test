/**
 * Route path definitions and helper builders for navigation.
 */
export const ROUTE_PATHS = {
  home: '/' as const,
  podcastDetail: '/podcast/:podcastId' as const,
  episodeDetail: '/podcast/:podcastId/episode/:episodeId' as const,
};

/**
 * Provides the home route.
 *
 * @returns Home route path.
 */
export const buildHomeRoute = (): string => ROUTE_PATHS.home;

/**
 * Builds the podcast detail route for the provided identifier.
 *
 * @param podcastId Unique podcast identifier.
 * @returns Podcast detail route.
 */
export const buildPodcastDetailRoute = (podcastId: string): string => `/podcast/${podcastId}`;

/**
 * Builds the episode detail route for the provided identifiers.
 *
 * @param podcastId Podcast identifier.
 * @param episodeId Episode identifier.
 * @returns Episode detail route.
 */
export const buildEpisodeDetailRoute = (podcastId: string, episodeId: string): string =>
  `${buildPodcastDetailRoute(podcastId)}/episode/${episodeId}`;
