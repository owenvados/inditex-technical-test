import { EpisodeService } from '@podcasts/application/services/episode/EpisodeService';
import { PodcastCardService } from '@podcasts/application/services/podcast/PodcastCardService';
import { PodcastDetailService } from '@podcasts/application/services/podcast/PodcastDetailService';
import { GetPodcastDetail } from '@podcasts/application/use-cases/podcast/GetPodcastDetail';
import { GetTopPodcasts } from '@podcasts/application/use-cases/podcast/GetTopPodcasts';
import { PodcastDescriptionEnricher } from '@podcasts/infrastructure/enrichers/PodcastDescriptionEnricher';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';

// Singleton instances
let getTopPodcastsInstance: GetTopPodcasts | null = null;
let getPodcastDetailInstance: GetPodcastDetail | null = null;
let podcastCardServiceInstance: PodcastCardService | null = null;
let podcastDetailServiceInstance: PodcastDetailService | null = null;
let episodeServiceInstance: EpisodeService | null = null;

/**
 * Creates the repository instance (shared by all use cases).
 */
const createRepository = (): ITunesPodcastRepository => {
  return new ITunesPodcastRepository(new PodcastDescriptionEnricher());
};

/**
 * Creates and returns the GetTopPodcasts use case instance.
 *
 * @returns GetTopPodcasts use case instance.
 */
export const getGetTopPodcasts = (): GetTopPodcasts => {
  if (!getTopPodcastsInstance) {
    getTopPodcastsInstance = new GetTopPodcasts(createRepository());
  }
  return getTopPodcastsInstance;
};

/**
 * Creates and returns the GetPodcastDetail use case instance.
 *
 * @returns GetPodcastDetail use case instance.
 */
export const getGetPodcastDetail = (): GetPodcastDetail => {
  if (!getPodcastDetailInstance) {
    getPodcastDetailInstance = new GetPodcastDetail(createRepository());
  }
  return getPodcastDetailInstance;
};

/**
 * Creates and returns the PodcastCardService instance.
 *
 * @returns PodcastCardService instance.
 */
export const getPodcastCardService = (): PodcastCardService => {
  if (!podcastCardServiceInstance) {
    podcastCardServiceInstance = new PodcastCardService();
  }
  return podcastCardServiceInstance;
};

/**
 * Creates and returns the PodcastDetailService instance.
 *
 * @returns PodcastDetailService instance.
 */
export const getPodcastDetailService = (): PodcastDetailService => {
  if (!podcastDetailServiceInstance) {
    podcastDetailServiceInstance = new PodcastDetailService();
  }
  return podcastDetailServiceInstance;
};

/**
 * Creates and returns the EpisodeService instance.
 *
 * @returns EpisodeService instance.
 */
export const getEpisodeService = (): EpisodeService => {
  if (!episodeServiceInstance) {
    episodeServiceInstance = new EpisodeService();
  }
  return episodeServiceInstance;
};

/**
 * Clears all dependency instances. Intended for testing scenarios.
 */
export const resetDependencyContainer = (): void => {
  getTopPodcastsInstance = null;
  getPodcastDetailInstance = null;
  podcastCardServiceInstance = null;
  podcastDetailServiceInstance = null;
  episodeServiceInstance = null;
};
