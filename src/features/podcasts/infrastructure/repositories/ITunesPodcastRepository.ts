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
 * Repository adapter that retrieves podcasts from the iTunes API.
 */
export class ITunesPodcastRepository implements IPodcastRepository {
  constructor(
    private readonly descriptionEnricher: PodcastDescriptionEnricher = new PodcastDescriptionEnricher(),
  ) {}

  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts();
    return mapToPodcastList(response);
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const response = await iTunesPodcastClient.getPodcastDetail(podcastId);
    const detail = mapToPodcastDetail(response);
    const feedUrl = resolveFeedUrl(response.results ?? []);

    return this.descriptionEnricher.enrich(detail, feedUrl);
  }
}
