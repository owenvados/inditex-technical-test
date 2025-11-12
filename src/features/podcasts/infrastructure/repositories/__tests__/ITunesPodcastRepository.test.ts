import { FeedContentClient } from '@podcasts/infrastructure/api/FeedContentClient';
import { DEFAULT_PODCAST_SUMMARY } from '@podcasts/infrastructure/mappers/mapperConstants';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { PodcastDescriptionEnricher } from '@podcasts/infrastructure/services/PodcastDescriptionEnricher';

jest.mock('@podcasts/infrastructure/api/ITunesPodcastClient', () => ({
  iTunesPodcastClient: {
    getTopPodcasts: jest.fn(),
    getPodcastDetail: jest.fn(),
  },
}));

const { iTunesPodcastClient } = jest.requireMock(
  '@podcasts/infrastructure/api/ITunesPodcastClient',
);

const createFeedClientMock = (): jest.Mocked<FeedContentClient> =>
  ({
    fetchChannelSummary: jest.fn(),
    fetchItemDescriptions: jest.fn(),
  }) as unknown as jest.Mocked<FeedContentClient>;

const createEnricherMock = (
  feedClient: jest.Mocked<FeedContentClient>,
): PodcastDescriptionEnricher => {
  return new PodcastDescriptionEnricher(feedClient as unknown as FeedContentClient);
};

const createLookupResponse = (overrides: Record<string, unknown> = {}) => ({
  resultCount: 2,
  results: [
    {
      collectionId: 123,
      collectionName: 'Test collection',
      artistName: 'Test artist',
      artworkUrl600: 'https://image.example.com/600.png',
      feedUrl: 'https://feed.example.com/rss',
      description: overrides.description ?? 'Original description',
      ...overrides,
    },
    {
      trackId: 999,
      trackName: 'Episode title',
      episodeUrl: 'https://cdn.example.com/episode.mp3',
      releaseDate: '2025-01-01T00:00:00Z',
      trackTimeMillis: 60_000,
      episodeGuid: 'episode-guid-1',
    },
  ],
});

const createFeedListResponse = () => ({
  feed: {
    entry: [
      {
        id: { attributes: { 'im:id': 'podcast-1' } },
        'im:name': { label: 'Podcast one' },
        'im:artist': { label: 'Artist one' },
        'im:image': [{ label: 'https://image.example.com/170.png' }],
        summary: { label: 'Summary one' },
      },
    ],
  },
});

describe('ITunesPodcastRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns top podcasts mapped from the API response', async () => {
    (iTunesPodcastClient.getTopPodcasts as jest.Mock).mockResolvedValue(createFeedListResponse());
    const repository = new ITunesPodcastRepository();

    const podcasts = await repository.getTopPodcasts();
    expect(podcasts).toHaveLength(1);
    expect(podcasts[0]).toMatchObject({
      id: 'podcast-1',
      title: 'Podcast one',
      author: 'Artist one',
    });
  });

  it('returns podcast detail using feed description when lookup summary is missing', async () => {
    const feedClientMock = createFeedClientMock();
    feedClientMock.fetchChannelSummary.mockResolvedValue('Feed summary value');
    feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

    (iTunesPodcastClient.getPodcastDetail as jest.Mock).mockResolvedValue(
      createLookupResponse({ description: undefined }),
    );

    const enricher = createEnricherMock(feedClientMock);
    const repository = new ITunesPodcastRepository(enricher);
    const detail = await repository.getPodcastDetail('123');

    expect(feedClientMock.fetchChannelSummary).toHaveBeenCalledWith('https://feed.example.com/rss');
    expect(feedClientMock.fetchItemDescriptions).toHaveBeenCalledWith(
      'https://feed.example.com/rss',
    );
    expect(detail.podcast.summary).toBe('Feed summary value');
  });

  it('keeps lookup summary when present and skips feed fetch', async () => {
    const feedClientMock = createFeedClientMock();
    feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

    (iTunesPodcastClient.getPodcastDetail as jest.Mock).mockResolvedValue(createLookupResponse());

    const enricher = createEnricherMock(feedClientMock);
    const repository = new ITunesPodcastRepository(enricher);
    const detail = await repository.getPodcastDetail('123');

    expect(feedClientMock.fetchChannelSummary).not.toHaveBeenCalled();
    expect(feedClientMock.fetchItemDescriptions).toHaveBeenCalledWith(
      'https://feed.example.com/rss',
    );
    expect(detail.podcast.summary).toBe('Original description');
    expect(detail).toMatchObject({
      podcast: {
        summary: 'Original description',
      },
    });
  });

  it('returns default summary when feed fetch fails', async () => {
    const feedClientMock = createFeedClientMock();
    feedClientMock.fetchChannelSummary.mockResolvedValue(undefined);
    feedClientMock.fetchItemDescriptions.mockResolvedValue(new Map());

    (iTunesPodcastClient.getPodcastDetail as jest.Mock).mockResolvedValue(
      createLookupResponse({ description: undefined }),
    );

    const enricher = createEnricherMock(feedClientMock);
    const repository = new ITunesPodcastRepository(enricher);
    const detail = await repository.getPodcastDetail('123');

    expect(feedClientMock.fetchChannelSummary).toHaveBeenCalled();
    expect(feedClientMock.fetchItemDescriptions).toHaveBeenCalled();
    expect(detail.podcast.summary).toBe(DEFAULT_PODCAST_SUMMARY);
  });

  it('enriches episodes with HTML description from feed', async () => {
    const feedClientMock = createFeedClientMock();
    feedClientMock.fetchChannelSummary.mockResolvedValue(undefined);
    feedClientMock.fetchItemDescriptions.mockResolvedValue(
      new Map([['episode-guid-1', '<p>Rich description</p>']]),
    );

    (iTunesPodcastClient.getPodcastDetail as jest.Mock).mockResolvedValue(
      createLookupResponse({ description: undefined }),
    );

    const enricher = createEnricherMock(feedClientMock);
    const repository = new ITunesPodcastRepository(enricher);
    const detail = await repository.getPodcastDetail('123');

    expect(detail.episodes[0]).toMatchObject({
      id: '999',
      guid: 'episode-guid-1',
      description: '<p>Rich description</p>',
    });
  });
});
