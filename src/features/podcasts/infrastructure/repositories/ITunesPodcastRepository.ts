import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';
import { iTunesPodcastClient } from '@podcasts/infrastructure/api/ITunesPodcastClient';
import { mapToPodcastList } from '@podcasts/infrastructure/mappers/podcastMapper';

/**
 * Repository adapter that retrieves podcasts from the iTunes API.
 */
export class ITunesPodcastRepository implements IPodcastRepository {
  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts();
    return mapToPodcastList(response);
  }
}
