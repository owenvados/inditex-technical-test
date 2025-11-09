import { buildTopPodcastsFeedUrl } from '@podcasts/infrastructure/config/apiConfig';
import { HttpClient, httpClient } from '@shared/infrastructure/http/HttpClient';

export type TopPodcastsResponse = {
  feed?: {
    entry?: unknown[];
  };
};

/**
 * Client responsible for fetching data from the iTunes public API.
 */
export class ITunesPodcastClient {
  constructor(private readonly client: HttpClient = httpClient) {}

  /**
   * Retrieves the top podcasts feed as provided by iTunes.
   *
   * @returns Promise resolving with the feed payload.
   */
  async getTopPodcasts(): Promise<TopPodcastsResponse> {
    const url = buildTopPodcastsFeedUrl();
    return this.client.get<TopPodcastsResponse>(url, true);
  }
}

export const iTunesPodcastClient = new ITunesPodcastClient();
