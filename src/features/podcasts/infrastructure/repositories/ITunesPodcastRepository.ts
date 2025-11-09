import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';
import { iTunesPodcastClient } from '@podcasts/infrastructure/api/ITunesPodcastClient';
import {
  mapToPodcastDetail,
  mapToPodcastList,
} from '@podcasts/infrastructure/mappers/podcastMapper';

/**
 * Repository adapter that retrieves podcasts from the iTunes API.
 */
export class ITunesPodcastRepository implements IPodcastRepository {
  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts();
    return mapToPodcastList(response);
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const response = await iTunesPodcastClient.getPodcastDetail(podcastId);
    return mapToPodcastDetail(response);
  }
}
