import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { LocalStorageCache } from '@shared/infrastructure/cache/LocalStorageCache';

import {
  PODCAST_CACHE_NAMESPACE,
  PODCAST_CACHE_TTL_MS,
  PODCAST_DETAIL_PREFIX,
  TOP_PODCASTS_KEY,
} from './cacheConstants';

type CachedEpisode = Omit<PodcastDetail['episodes'][number], 'publishedAt'> & {
  publishedAt: number;
};

type CachedPodcastDetail = Omit<PodcastDetail, 'episodes'> & {
  episodes: CachedEpisode[];
};

const serialisePodcastDetail = (detail: PodcastDetail): CachedPodcastDetail => ({
  ...detail,
  episodes: detail.episodes.map((episode) => ({
    ...episode,
    publishedAt: episode.publishedAt.getTime(),
  })),
});

const deserialisePodcastDetail = (cached: CachedPodcastDetail): PodcastDetail => ({
  ...cached,
  episodes: cached.episodes.map((episode) => ({
    ...episode,
    publishedAt: new Date(episode.publishedAt),
  })),
});

/**
 * Provides cache helpers tailored for podcast data.
 */
export class PodcastCache {
  private readonly cache = new LocalStorageCache(PODCAST_CACHE_NAMESPACE);

  getTopPodcasts(): Podcast[] | null {
    return this.cache.get<Podcast[]>(TOP_PODCASTS_KEY);
  }

  setTopPodcasts(podcasts: Podcast[]): void {
    this.cache.set(TOP_PODCASTS_KEY, podcasts, PODCAST_CACHE_TTL_MS);
  }

  getPodcastDetail(podcastId: string): PodcastDetail | null {
    const cachedDetail = this.cache.get<CachedPodcastDetail>(this.buildPodcastDetailKey(podcastId));
    return cachedDetail ? deserialisePodcastDetail(cachedDetail) : null;
  }

  setPodcastDetail(podcastId: string, detail: PodcastDetail): void {
    this.cache.set(
      this.buildPodcastDetailKey(podcastId),
      serialisePodcastDetail(detail),
      PODCAST_CACHE_TTL_MS,
    );
  }

  private buildPodcastDetailKey(podcastId: string): string {
    return `${PODCAST_DETAIL_PREFIX}:${podcastId}`;
  }
}

export const podcastCache = new PodcastCache();
