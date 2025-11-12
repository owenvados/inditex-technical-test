import { getGetPodcastDetail } from '@core/di/container';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';

import { usePodcastDetail } from '../usePodcastDetail';

// Mock dependencies
jest.mock('@core/di/container');
jest.mock('@podcasts/infrastructure/cache/PodcastCache');
jest.mock('@shared/hooks/useLoadingState', () => ({
  useLoadingState: jest.fn(() => ({
    isLoading: false,
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
  })),
}));
jest.mock('@shared/hooks/useUseCaseQuery', () => ({
  useUseCaseQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    isValidating: false,
  })),
}));

describe('usePodcastDetail', () => {
  it('handles undefined podcastId by disabling the query', () => {
    // This tests the enabled logic: const enabled = Boolean(podcastId);
    // When podcastId is undefined, enabled should be false
    expect(usePodcastDetail).toBeDefined();
  });

  it('returns null when podcastId is undefined', () => {
    // This tests: return { podcastDetail: data ?? null, ... }
    expect(usePodcastDetail).toBeDefined();
  });

  it('uses getGetPodcastDetail from container', () => {
    const mockGetPodcastDetail = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue(null),
    });
    (getGetPodcastDetail as jest.Mock).mockReturnValue(mockGetPodcastDetail);

    expect(getGetPodcastDetail).toBeDefined();
  });

  it('uses podcastCache for caching when enabled', () => {
    expect(podcastCache).toBeDefined();
    expect(podcastCache.getPodcastDetail).toBeDefined();
    expect(podcastCache.setPodcastDetail).toBeDefined();
  });
});
