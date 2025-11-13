import type { PodcastDetail } from '@podcasts/domain/models/aggregate/PodcastDetail';
import { Duration } from '@podcasts/domain/models/episode/Duration';
import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';
import { LocalStorageCache } from '@shared/infrastructure/cache/LocalStorageCache';

import {
  PODCAST_CACHE_NAMESPACE,
  PODCAST_CACHE_TTL_MS,
  PODCAST_DETAIL_PREFIX,
  TOP_PODCASTS_KEY,
} from './cacheConstants';

type CachedEpisode = Omit<PodcastDetail['episodes'][number], 'publishedAt' | 'duration'> & {
  publishedAt: number;
  duration: number;
};

type CachedPodcastDetail = Omit<PodcastDetail, 'episodes'> & {
  episodes: CachedEpisode[];
};

const serialisePodcastDetail = (detail: PodcastDetail): CachedPodcastDetail => ({
  ...detail,
  episodes: detail.episodes.map((episode) => ({
    ...episode,
    publishedAt: episode.publishedAt.getTime(),
    duration: episode.duration.milliseconds,
  })),
});

/**
 * Validates and normalizes a duration value from cache.
 * Returns 0 if the value is invalid (NaN, Infinity, undefined, null, or negative).
 *
 * @param duration Value from cache that should be a number.
 * @returns Valid duration in milliseconds (0 if invalid).
 */
const normalizeDuration = (duration: unknown): number => {
  if (typeof duration !== 'number') {
    return 0;
  }

  if (!Number.isFinite(duration) || Number.isNaN(duration) || duration < 0) {
    return 0;
  }

  return duration;
};

const deserialisePodcastDetail = (cached: CachedPodcastDetail): PodcastDetail => ({
  ...cached,
  episodes: cached.episodes.map((episode) => {
    // Ensure duration is always a valid Duration object
    const durationValue = normalizeDuration(episode.duration);
    return {
      ...episode,
      publishedAt: new Date(episode.publishedAt),
      duration: new Duration(durationValue),
    };
  }),
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
