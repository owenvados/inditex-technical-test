import { FeedContentClient } from '@podcasts/infrastructure/api/FeedContentClient';
import type { HttpClient } from '@shared/infrastructure/http/HttpClient';

const FEED_URL = 'https://feed.example.com/rss';

const createHttpClientMock = (): jest.Mocked<HttpClient> =>
  ({
    get: jest.fn(),
    getText: jest.fn(),
  }) as unknown as jest.Mocked<HttpClient>;

describe('FeedContentClient', () => {
  // Reads the first available description tag for the channel summary.
  it('returns channel summary from the first available tag', async () => {
    const httpClientMock = createHttpClientMock();
    httpClientMock.getText.mockResolvedValue(`
      <rss>
        <channel>
          <description><![CDATA[<p>Sample <strong>description</strong></p>]]></description>
        </channel>
      </rss>
    `);

    const client = new FeedContentClient(httpClientMock);
    await expect(client.fetchChannelSummary(FEED_URL)).resolves.toBe('Sample description');
    expect(httpClientMock.getText).toHaveBeenCalledWith(FEED_URL, true, { timeoutMs: 20000 });
  });

  // Collects cleaned HTML per guid when items contain rich descriptions.
  it('extracts sanitized HTML descriptions keyed by guid', async () => {
    const httpClientMock = createHttpClientMock();
    httpClientMock.getText.mockResolvedValue(`
      <rss>
        <channel>
          <item>
            <guid>episode-1</guid>
            <content:encoded><![CDATA[<p>Episode <strong>HTML</strong><script>alert("x")</script></p>]]></content:encoded>
          </item>
          <item>
            <guid>episode-2</guid>
            <description><![CDATA[<p>Description <em>fallback</em></p>]]></description>
          </item>
        </channel>
      </rss>
    `);

    const client = new FeedContentClient(httpClientMock);
    const descriptions = await client.fetchItemDescriptions(FEED_URL);

    expect(descriptions.get('episode-1')).toBe('<p>Episode <strong>HTML</strong></p>');
    expect(descriptions.get('episode-2')).toBe('<p>Description <em>fallback</em></p>');
    expect(httpClientMock.getText).toHaveBeenCalledWith(FEED_URL, true, { timeoutMs: 20000 });
  });

  // Uses the internal cache so the feed is only fetched once.
  it('reuses cached documents between channel and item lookups', async () => {
    const httpClientMock = createHttpClientMock();
    httpClientMock.getText.mockResolvedValue(`
      <rss>
        <channel>
          <description>Summary</description>
          <item>
            <guid>episode-1</guid>
            <description>Episode description</description>
          </item>
        </channel>
      </rss>
    `);

    const client = new FeedContentClient(httpClientMock);
    await client.fetchChannelSummary(FEED_URL);
    await client.fetchItemDescriptions(FEED_URL);

    expect(httpClientMock.getText).toHaveBeenCalledTimes(1);
  });

  // Handles missing URLs by returning an empty collection.
  it('returns empty map when feed URL is missing', async () => {
    const httpClientMock = createHttpClientMock();
    const client = new FeedContentClient(httpClientMock);
    await expect(client.fetchItemDescriptions(undefined)).resolves.toEqual(new Map());
  });
});
