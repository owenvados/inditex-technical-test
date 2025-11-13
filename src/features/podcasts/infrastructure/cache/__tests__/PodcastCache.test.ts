import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { Duration } from '@podcasts/domain/value-objects/Duration';

import { PodcastCache } from '../PodcastCache';

// Mock LocalStorageCache
jest.mock('@shared/infrastructure/cache/LocalStorageCache');

describe('PodcastCache', () => {
  let cache: PodcastCache;
  let mockLocalStorageCache: {
    get: jest.Mock;
    set: jest.Mock;
  };

  beforeEach(() => {
    mockLocalStorageCache = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const { LocalStorageCache } = jest.requireMock(
      '@shared/infrastructure/cache/LocalStorageCache',
    );
    LocalStorageCache.mockImplementation(() => mockLocalStorageCache);

    cache = new PodcastCache();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopPodcasts', () => {
    it('returns cached podcasts when available', () => {
      const mockPodcasts: Podcast[] = [
        {
          id: '1',
          title: 'Test Podcast',
          author: 'Test Author',
          imageUrl: 'https://example.com/image.png',
          summary: 'Test summary',
        },
      ];

      mockLocalStorageCache.get.mockReturnValue(mockPodcasts);

      const result = cache.getTopPodcasts();

      expect(result).toEqual(mockPodcasts);
      expect(mockLocalStorageCache.get).toHaveBeenCalledWith('top-podcasts');
    });

    it('returns null when no cached podcasts exist', () => {
      mockLocalStorageCache.get.mockReturnValue(null);

      const result = cache.getTopPodcasts();

      expect(result).toBeNull();
    });
  });

  describe('setTopPodcasts', () => {
    it('stores podcasts in cache with TTL', () => {
      const podcasts: Podcast[] = [
        {
          id: '1',
          title: 'Test Podcast',
          author: 'Test Author',
          imageUrl: 'https://example.com/image.png',
          summary: 'Test summary',
        },
      ];

      cache.setTopPodcasts(podcasts);

      expect(mockLocalStorageCache.set).toHaveBeenCalledWith('top-podcasts', podcasts, 86400000);
    });
  });

  describe('getPodcastDetail', () => {
    it('returns deserialized podcast detail when cached', () => {
      const mockCachedDetail = {
        podcast: {
          id: '1',
          title: 'Test Podcast',
          author: 'Test Author',
          imageUrl: 'https://example.com/image.png',
          summary: 'Test summary',
        },
        episodes: [
          {
            id: 'ep1',
            title: 'Episode 1',
            description: 'Episode description',
            guid: 'guid-1',
            audioUrl: 'https://example.com/audio.mp3',
            durationMs: 3600000,
            publishedAt: 1609459200000, // Serialized date
          },
        ],
      };

      mockLocalStorageCache.get.mockReturnValue(mockCachedDetail);

      const result = cache.getPodcastDetail('1');

      expect(result).not.toBeNull();
      expect(result?.podcast.id).toBe('1');
      expect(result?.episodes[0].publishedAt).toBeInstanceOf(Date);
      expect(result?.episodes[0].publishedAt.getTime()).toBe(1609459200000);
      expect(result?.episodes[0].duration).toBeInstanceOf(Duration);
      expect(result?.episodes[0].duration.toMilliseconds()).toBe(3600000);
    });

    it('returns null when no cached detail exists', () => {
      mockLocalStorageCache.get.mockReturnValue(null);

      const result = cache.getPodcastDetail('1');

      expect(result).toBeNull();
    });
  });

  describe('setPodcastDetail', () => {
    it('serializes and stores podcast detail with TTL', () => {
      const detail: PodcastDetail = {
        podcast: {
          id: '1',
          title: 'Test Podcast',
          author: 'Test Author',
          imageUrl: 'https://example.com/image.png',
          summary: 'Test summary',
        },
        episodes: [
          {
            id: 'ep1',
            title: 'Episode 1',
            description: 'Episode description',
            guid: 'guid-1',
            audioUrl: 'https://example.com/audio.mp3',
            duration: new Duration(3600000),
            publishedAt: new Date(1609459200000),
          },
        ],
      };

      cache.setPodcastDetail('1', detail);

      expect(mockLocalStorageCache.set).toHaveBeenCalledWith(
        'podcast-detail:1',
        expect.objectContaining({
          podcast: detail.podcast,
          episodes: expect.arrayContaining([
            expect.objectContaining({
              publishedAt: 1609459200000, // Serialized date
              durationMs: 3600000, // Serialized duration
            }),
          ]),
        }),
        86400000,
      );
    });
  });
});
