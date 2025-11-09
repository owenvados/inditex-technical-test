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
    return this.client.get<TopPodcastsResponse>(url, false);
  }

  /**
   * Retrieves the detailed podcast information including episodes.
   *
   * @param podcastId Identifier of the podcast to lookup.
   * @returns Promise resolving with the lookup payload.
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
