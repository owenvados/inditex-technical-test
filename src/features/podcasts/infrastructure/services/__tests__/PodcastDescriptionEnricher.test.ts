import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { Duration } from '@podcasts/domain/value-objects/Duration';
import { FeedContentClient } from '@podcasts/infrastructure/api/FeedContentClient';
import { DEFAULT_PODCAST_SUMMARY } from '@podcasts/infrastructure/mappers/mapperConstants';

import { PodcastDescriptionEnricher } from '../PodcastDescriptionEnricher';

describe('PodcastDescriptionEnricher', () => {
  let enricher: PodcastDescriptionEnricher;
  let feedClientMock: jest.Mocked<FeedContentClient>;

  beforeEach(() => {
    feedClientMock = {
      fetchChannelSummary: jest.fn(),
      fetchItemDescriptions: jest.fn(),
    } as unknown as jest.Mocked<FeedContentClient>;

    enricher = new PodcastDescriptionEnricher(feedClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enrich', () => {
    const baseDetail: PodcastDetail = {
      podcast: {
        id: '123',
        title: 'Test Podcast',
        author: 'Test Author',
        imageUrl: 'https://example.com/image.png',
        summary: DEFAULT_PODCAST_SUMMARY,
      },
      episodes: [
        {
          id: 'ep-1',
          title: 'Episode 1',
          description: 'Original description',
          guid: 'guid-1',
          audioUrl: 'https://example.com/audio.mp3',
          publishedAt: new Date('2025-01-01'),
          duration: new Duration(3600000),
        },
      ],
    };

    it('returns detail unchanged when feedUrl is not provided', async () => {
      const result = await enricher.enrich(baseDetail);

      expect(result).toEqual(baseDetail);
      expect(feedClientMock.fetchChannelSummary).not.toHaveBeenCalled();
      expect(feedClientMock.fetchItemDescriptions).not.toHaveBeenCalled();
    });

    it('enriches summary when current summary is default', async () => {
      feedClientMock.fetchChannelSummary.mockResolvedValue('Enriched summary');
      feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

      const result = await enricher.enrich(baseDetail, 'https://feed.example.com/rss');

      expect(result.podcast.summary).toBe('Enriched summary');
      expect(feedClientMock.fetchChannelSummary).toHaveBeenCalledWith(
        'https://feed.example.com/rss',
      );
    });

    it('keeps original summary when it is not default', async () => {
      const detailWithSummary: PodcastDetail = {
        ...baseDetail,
        podcast: {
          ...baseDetail.podcast,
          summary: 'Original summary',
        },
      };

      feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

      const result = await enricher.enrich(detailWithSummary, 'https://feed.example.com/rss');

      expect(result.podcast.summary).toBe('Original summary');
      expect(feedClientMock.fetchChannelSummary).not.toHaveBeenCalled();
    });

    it('enriches episode descriptions by guid', async () => {
      const descriptions = new Map([['guid-1', '<p>Enriched episode description</p>']]);
      feedClientMock.fetchChannelSummary.mockResolvedValue(undefined);
      feedClientMock.fetchItemDescriptions.mockResolvedValue(descriptions);

      const result = await enricher.enrich(baseDetail, 'https://feed.example.com/rss');

      expect(result.episodes[0].description).toBe('<p>Enriched episode description</p>');
      expect(feedClientMock.fetchItemDescriptions).toHaveBeenCalledWith(
        'https://feed.example.com/rss',
      );
    });

    it('enriches episode descriptions by id when guid is missing', async () => {
      const detailWithoutGuid: PodcastDetail = {
        ...baseDetail,
        episodes: [
          {
            ...baseDetail.episodes[0],
            guid: undefined,
          },
        ],
      };

      const descriptions = new Map([['ep-1', '<p>Enriched by ID</p>']]);
      feedClientMock.fetchChannelSummary.mockResolvedValue(undefined);
      feedClientMock.fetchItemDescriptions.mockResolvedValue(descriptions);

      const result = await enricher.enrich(detailWithoutGuid, 'https://feed.example.com/rss');

      expect(result.episodes[0].description).toBe('<p>Enriched by ID</p>');
    });

    it('keeps original description when no match found', async () => {
      feedClientMock.fetchChannelSummary.mockResolvedValue(undefined);
      feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

      const result = await enricher.enrich(baseDetail, 'https://feed.example.com/rss');

      expect(result.episodes[0].description).toBe('Original description');
    });

    it('handles empty descriptions map', async () => {
      feedClientMock.fetchChannelSummary.mockResolvedValue(undefined);
      feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

      const result = await enricher.enrich(baseDetail, 'https://feed.example.com/rss');

      expect(result.episodes).toEqual(baseDetail.episodes);
    });
  });
});
