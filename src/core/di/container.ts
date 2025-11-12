import { GetPodcastDetail } from '@podcasts/application/use-cases/GetPodcastDetail';
import { GetTopPodcasts } from '@podcasts/application/use-cases/GetTopPodcasts';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { PodcastDescriptionEnricher } from '@podcasts/infrastructure/services/PodcastDescriptionEnricher';

type Dependencies = {
  podcastRepository: IPodcastRepository;
  getTopPodcasts: GetTopPodcasts;
  getPodcastDetail: GetPodcastDetail;
};

let dependencyStore: Dependencies | null = null;

const buildDependencies = (): Dependencies => {
  const podcastRepository = new ITunesPodcastRepository(new PodcastDescriptionEnricher());

  return {
    podcastRepository,
    getTopPodcasts: new GetTopPodcasts(podcastRepository),
    getPodcastDetail: new GetPodcastDetail(podcastRepository),
  };
};

const ensureDependencies = (): Dependencies => {
  if (!dependencyStore) {
    dependencyStore = buildDependencies();
  }

  return dependencyStore;
};

/**
 * Resolves a dependency managed by the application container.
 *
 * @param token Dependency identifier.
 * @returns Resolved dependency instance.
 */
export const resolveDependency = <Token extends keyof Dependencies>(
  token: Token,
): Dependencies[Token] => ensureDependencies()[token];

/**
 * Clears the dependency cache. Intended for testing scenarios.
 */
export const resetDependencyContainer = (): void => {
  dependencyStore = null;
};
