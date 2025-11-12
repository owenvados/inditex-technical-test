import { GetPodcastDetail } from '@podcasts/application/use-cases/GetPodcastDetail';
import { GetTopPodcasts } from '@podcasts/application/use-cases/GetTopPodcasts';
import { PodcastDescriptionEnricher } from '@podcasts/infrastructure/enrichers/PodcastDescriptionEnricher';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';

// Singleton instances
let getTopPodcastsInstance: GetTopPodcasts | null = null;
let getPodcastDetailInstance: GetPodcastDetail | null = null;

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
 * Clears all dependency instances. Intended for testing scenarios.
 */
export const resetDependencyContainer = (): void => {
  getTopPodcastsInstance = null;
  getPodcastDetailInstance = null;
};
