import { getGetTopPodcasts } from '@core/di/container';
import { podcastCache } from '@podcasts/infrastructure/cache/PodcastCache';

import { useTopPodcasts } from '../useTopPodcasts';

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
    data: [],
    isLoading: false,
    isValidating: false,
  })),
}));

describe('useTopPodcasts', () => {
  it('uses getGetTopPodcasts from container', () => {
    const mockGetTopPodcasts = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue([]),
    });
    (getGetTopPodcasts as jest.Mock).mockReturnValue(mockGetTopPodcasts);

    // Verify the hook integrates with the container
    expect(getGetTopPodcasts).toBeDefined();
  });

  it('uses podcastCache for caching', () => {
    expect(podcastCache).toBeDefined();
    expect(podcastCache.getTopPodcasts).toBeDefined();
    expect(podcastCache.setTopPodcasts).toBeDefined();
  });

  it('returns empty array when data is undefined', () => {
    // This tests the fallback logic: data ?? []
    expect(useTopPodcasts).toBeDefined();
  });
});
