import {
  buildEpisodeDetailRoute,
  buildHomeRoute,
  buildPodcastDetailRoute,
  ROUTE_PATHS,
} from '../routes';

describe('routes', () => {
  describe('ROUTE_PATHS', () => {
    it('defines home route', () => {
      expect(ROUTE_PATHS.home).toBe('/');
    });

    it('defines podcast detail route pattern', () => {
      expect(ROUTE_PATHS.podcastDetail).toBe('/podcast/:podcastId');
    });

    it('defines episode detail route pattern', () => {
      expect(ROUTE_PATHS.episodeDetail).toBe('/podcast/:podcastId/episode/:episodeId');
    });
  });

  describe('buildHomeRoute', () => {
    it('returns home route path', () => {
      expect(buildHomeRoute()).toBe('/');
    });
  });

  describe('buildPodcastDetailRoute', () => {
    it('builds route with podcast ID', () => {
      expect(buildPodcastDetailRoute('123')).toBe('/podcast/123');
    });

    it('handles different podcast IDs', () => {
      expect(buildPodcastDetailRoute('abc-123')).toBe('/podcast/abc-123');
    });
  });

  describe('buildEpisodeDetailRoute', () => {
    it('builds route with podcast and episode IDs', () => {
      expect(buildEpisodeDetailRoute('123', 'ep-456')).toBe('/podcast/123/episode/ep-456');
    });

    it('uses buildPodcastDetailRoute internally', () => {
      const podcastId = 'pod-789';
      const episodeId = 'ep-012';
      const result = buildEpisodeDetailRoute(podcastId, episodeId);

      expect(result).toContain(`/podcast/${podcastId}`);
      expect(result).toContain(`/episode/${episodeId}`);
    });
  });
});
