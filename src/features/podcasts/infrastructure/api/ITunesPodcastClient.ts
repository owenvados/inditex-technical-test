import {
  buildPodcastLookupUrl,
  buildTopPodcastsFeedUrl,
} from '@podcasts/infrastructure/config/apiConfig';
import { HttpClient, httpClient } from '@shared/infrastructure/http/HttpClient';

export type TopPodcastsResponse = {
  feed?: {
    entry?: unknown[];
  };
};

export type PodcastLookupResponse = {
  resultCount?: number;
  results?: unknown[];
};

/**
 * Client that fetches podcast data from the iTunes Podcast API.
 * Provides methods to retrieve top podcasts and detailed podcast information.
 */
export class ITunesPodcastClient {
  /**
   * Creates an instance of the iTunes podcast client.
   *
   * @param client HTTP client used to make API requests.
   */
  constructor(private readonly client: HttpClient = httpClient) {}

  /**
   * Fetches the top podcasts feed from the iTunes API.
   * Returns the RSS feed response containing the top podcasts.
   *
   * @returns Promise that resolves to the top podcasts feed response.
   */
  async getTopPodcasts(): Promise<TopPodcastsResponse> {
    const url = buildTopPodcastsFeedUrl();
    return this.client.get<TopPodcastsResponse>(url, false);
  }

  /**
   * Fetches detailed information about a specific podcast from the iTunes API.
   * Returns podcast metadata and episode information.
   * Throws an error if the podcast ID is empty or invalid.
   *
   * @param podcastId Unique identifier of the podcast to lookup.
   * @returns Promise that resolves to the podcast lookup response with episodes.
   * @throws Error if the podcast ID is empty or invalid.
   */
  async getPodcastDetail(podcastId: string): Promise<PodcastLookupResponse> {
    if (!podcastId || podcastId.trim() === '') {
      throw new Error('Podcast ID is required');
    }

    const url = buildPodcastLookupUrl(podcastId);
    const data = await this.client.get<PodcastLookupResponse>(url, false);
    return data;
  }
}

export const iTunesPodcastClient = new ITunesPodcastClient();
