import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';
import { iTunesPodcastClient } from '@podcasts/infrastructure/api/ITunesPodcastClient';
import {
  mapToPodcastDetail,
  mapToPodcastList,
} from '@podcasts/infrastructure/mappers/podcastMapper';
import { PodcastDescriptionEnricher } from '@podcasts/infrastructure/services/PodcastDescriptionEnricher';

const hasFeedUrl = (item: unknown): item is { feedUrl: string } =>
  typeof item === 'object' && item !== null && 'feedUrl' in (item as Record<string, unknown>);

const resolveFeedUrl = (lookupResponse: unknown[]): string | undefined =>
  lookupResponse.find(hasFeedUrl)?.feedUrl;

/**
 * Repository adapter that implements the podcast repository interface
 * by fetching data from the iTunes Podcast API.
 * Enriches podcast details with additional information from RSS feeds.
 */
export class ITunesPodcastRepository implements IPodcastRepository {
  /**
   * Creates an instance of the iTunes podcast repository.
   *
   * @param descriptionEnricher Service that enriches podcast descriptions from RSS feeds.
   */
  constructor(
    private readonly descriptionEnricher: PodcastDescriptionEnricher = new PodcastDescriptionEnricher(),
  ) {}

  /**
   * Fetches the top podcasts from the iTunes API.
   * Returns the list of podcasts ordered by popularity.
   *
   * @returns Promise that resolves to an array of podcast entities.
   */
  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts();
    return mapToPodcastList(response);
  }

  /**
   * Fetches detailed information about a specific podcast from the iTunes API.
   * Enriches the podcast detail with additional information from RSS feeds if available.
   *
   * @param podcastId Unique identifier of the podcast to retrieve.
   * @returns Promise that resolves to a podcast detail aggregate with enriched descriptions.
   */
  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const response = await iTunesPodcastClient.getPodcastDetail(podcastId);
    const detail = mapToPodcastDetail(response);
    const feedUrl = resolveFeedUrl(response.results ?? []);

    return this.descriptionEnricher.enrich(detail, feedUrl);
  }
}
