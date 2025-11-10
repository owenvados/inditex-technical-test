import {
  ITunesPodcastClient,
  type PodcastLookupResponse,
  type TopPodcastsResponse,
} from '@podcasts/infrastructure/api/ITunesPodcastClient';
import {
  buildPodcastLookupUrl,
  buildTopPodcastsFeedUrl,
} from '@podcasts/infrastructure/config/apiConfig';
import type { HttpClient } from '@shared/infrastructure/http/HttpClient';

const createHttpClientMock = (): jest.Mocked<HttpClient> =>
  ({
    get: jest.fn(),
    getText: jest.fn(),
  }) as unknown as jest.Mocked<HttpClient>;

jest.mock('@podcasts/infrastructure/config/apiConfig', () => ({
  buildTopPodcastsFeedUrl: jest.fn(() => 'https://itunes.example.com/feed'),
  buildPodcastLookupUrl: jest.fn(
    (podcastId: string) => `https://itunes.example.com/lookup/${podcastId}`,
  ),
}));

describe('ITunesPodcastClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches top podcasts feed using the HTTP client', async () => {
    const httpClientMock = createHttpClientMock();
    const expectedResponse: TopPodcastsResponse = { feed: { entry: [] } };
    httpClientMock.get.mockResolvedValue(expectedResponse);

    const client = new ITunesPodcastClient(httpClientMock);
    const result = await client.getTopPodcasts();

    expect(buildTopPodcastsFeedUrl).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith('https://itunes.example.com/feed', false);
    expect(result).toBe(expectedResponse);
  });

  it('fetches podcast detail using the lookup URL', async () => {
    const httpClientMock = createHttpClientMock();
    const expectedResponse: PodcastLookupResponse = { results: [] };
    httpClientMock.get.mockResolvedValue(expectedResponse);

    const client = new ITunesPodcastClient(httpClientMock);
    const result = await client.getPodcastDetail('podcast-123');

    expect(buildPodcastLookupUrl).toHaveBeenCalledWith('podcast-123');
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'https://itunes.example.com/lookup/podcast-123',
      false,
    );
    expect(result).toBe(expectedResponse);
  });

  it('throws when podcast identifier is missing', async () => {
    const httpClientMock = createHttpClientMock();
    const client = new ITunesPodcastClient(httpClientMock);

    await expect(client.getPodcastDetail('')).rejects.toThrow('Podcast ID is required');
    expect(httpClientMock.get).not.toHaveBeenCalled();
  });
});
