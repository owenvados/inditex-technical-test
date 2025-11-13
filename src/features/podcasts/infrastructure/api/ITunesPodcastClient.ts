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
  constructor(private readonly client: HttpClient = httpClient) {}

  async getTopPodcasts(): Promise<TopPodcastsResponse> {
    return this.client.get<TopPodcastsResponse>(buildTopPodcastsFeedUrl(), false);
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastLookupResponse> {
    if (!podcastId?.trim()) {
      throw new Error('Podcast ID is required');
    }
    // iTunes API requires CORS proxy due to CORS restrictions
    return this.client.get<PodcastLookupResponse>(buildPodcastLookupUrl(podcastId), false);
  }
}

export const iTunesPodcastClient = new ITunesPodcastClient();
