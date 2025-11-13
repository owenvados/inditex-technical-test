import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { Duration } from '@podcasts/domain/value-objects/Duration';
import { LocalStorageCache } from '@shared/infrastructure/cache/LocalStorageCache';

import {
  PODCAST_CACHE_NAMESPACE,
  PODCAST_CACHE_TTL_MS,
  PODCAST_DETAIL_PREFIX,
  TOP_PODCASTS_KEY,
} from './cacheConstants';

type CachedEpisode = Omit<PodcastDetail['episodes'][number], 'publishedAt' | 'duration'> & {
  publishedAt: number;
  durationMs: number;
};

type CachedPodcastDetail = Omit<PodcastDetail, 'episodes'> & {
  episodes: CachedEpisode[];
};

const serialisePodcastDetail = (detail: PodcastDetail): CachedPodcastDetail => ({
  ...detail,
  episodes: detail.episodes.map((episode) => ({
    ...episode,
    publishedAt: episode.publishedAt.getTime(),
    durationMs: episode.duration.toMilliseconds(),
  })),
});

const deserialisePodcastDetail = (cached: CachedPodcastDetail): PodcastDetail => ({
  ...cached,
  episodes: cached.episodes.map((episode) => {
    const { durationMs, ...rest } = episode;
    return {
      ...rest,
      publishedAt: new Date(episode.publishedAt),
      duration: new Duration(durationMs),
    };
  }),
});

/**
 * Cache service that provides specialized caching functionality for podcast data.
 * Handles serialization and deserialization of podcast details including date conversion.
 * Uses localStorage as the underlying storage mechanism with time-to-live (TTL) expiration.
 */
export class PodcastCache {
  private readonly cache = new LocalStorageCache(PODCAST_CACHE_NAMESPACE);

  /**
   * Retrieves the cached top podcasts list.
   * Returns null if the cache is empty or expired.
   *
   * @returns Cached array of podcast entities, or null if not found or expired.
   */
  getTopPodcasts(): Podcast[] | null {
    return this.cache.get<Podcast[]>(TOP_PODCASTS_KEY);
  }

  /**
   * Stores the top podcasts list in the cache.
   * Uses the configured TTL for cache expiration.
   *
   * @param podcasts Array of podcast entities to cache.
   */
  setTopPodcasts(podcasts: Podcast[]): void {
    this.cache.set(TOP_PODCASTS_KEY, podcasts, PODCAST_CACHE_TTL_MS);
  }

  /**
   * Retrieves the cached podcast detail for a specific podcast.
   * Converts serialized dates back to Date objects and durations back to Duration value objects.
   * Returns null if the cache is empty or expired.
   *
   * @param podcastId Unique identifier of the podcast to retrieve from cache.
   * @returns Cached podcast detail aggregate, or null if not found or expired.
   */
  getPodcastDetail(podcastId: string): PodcastDetail | null {
    const cachedDetail = this.cache.get<CachedPodcastDetail>(this.buildPodcastDetailKey(podcastId));
    return cachedDetail ? deserialisePodcastDetail(cachedDetail) : null;
  }

  /**
   * Stores the podcast detail in the cache.
   * Converts Date objects to timestamps and Duration objects to milliseconds for serialization.
   * Uses the configured TTL for cache expiration.
   *
   * @param podcastId Unique identifier of the podcast to cache.
   * @param detail Podcast detail aggregate to cache.
   */
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
