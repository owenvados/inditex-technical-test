import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';
import {
  FeedContentClient,
  type FeedItemDescriptionMap,
} from '@podcasts/infrastructure/api/FeedContentClient';
import { iTunesPodcastClient } from '@podcasts/infrastructure/api/ITunesPodcastClient';
import { DEFAULT_PODCAST_SUMMARY } from '@podcasts/infrastructure/mappers/mapperConstants';
import {
  mapToPodcastDetail,
  mapToPodcastList,
} from '@podcasts/infrastructure/mappers/podcastMapper';

/**
 * Repository adapter that retrieves podcasts from the iTunes API.
 */
export class ITunesPodcastRepository implements IPodcastRepository {
  constructor(private readonly feedClient: FeedContentClient = new FeedContentClient()) {}

  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts();
    return mapToPodcastList(response);
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const response = await iTunesPodcastClient.getPodcastDetail(podcastId);
    const detail = mapToPodcastDetail(response);

    const feedRecord = (response.results ?? []).find(
      (item: unknown) =>
        typeof item === 'object' && item !== null && 'feedUrl' in (item as Record<string, unknown>),
    ) as { feedUrl?: string } | undefined;

    if (!feedRecord?.feedUrl) {
      return detail;
    }

    const [feedSummary, episodeDescriptions] = await Promise.all([
      detail.podcast.summary === DEFAULT_PODCAST_SUMMARY
        ? this.feedClient.fetchChannelSummary(feedRecord.feedUrl)
        : Promise.resolve<string | undefined>(undefined),
      this.feedClient.fetchItemDescriptions(feedRecord.feedUrl),
    ]);

    const summary = feedSummary ?? detail.podcast.summary;
    const episodes = this.mergeEpisodeDescriptions(detail.episodes, episodeDescriptions);

    return {
      ...detail,
      podcast: {
        ...detail.podcast,
        summary,
      },
      episodes,
    };
  }

  /**
   * Merges RSS-provided HTML descriptions into the episode list.
   *
   * @param episodes Domain episodes resolved from the lookup API.
   * @param descriptions HTML snippets keyed by GUID or identifier.
   * @returns Episodes enriched with RSS descriptions when available.
   */
  private mergeEpisodeDescriptions(
    episodes: PodcastDetail['episodes'],
    descriptions: FeedItemDescriptionMap,
  ): PodcastDetail['episodes'] {
    if (descriptions.size === 0) {
      return episodes;
    }

    return episodes.map((episode) => {
      const match =
        (episode.guid && descriptions.get(episode.guid)) ?? descriptions.get(episode.id);

      if (!match) {
        return episode;
      }

      return {
        ...episode,
        description: match,
      };
    });
  }
}
