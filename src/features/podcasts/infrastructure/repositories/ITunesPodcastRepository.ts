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

const hasFeedUrl = (item: unknown): item is { feedUrl: string } =>
  typeof item === 'object' && item !== null && 'feedUrl' in (item as Record<string, unknown>);

const resolveFeedUrl = (lookupResponse: unknown[]): string | undefined =>
  lookupResponse.find(hasFeedUrl)?.feedUrl;

const enrichPodcastSummary = async (
  currentSummary: string,
  feedUrl: string,
  feedClient: FeedContentClient,
): Promise<string> => {
  if (currentSummary !== DEFAULT_PODCAST_SUMMARY) {
    return currentSummary;
  }

  const summary = await feedClient.fetchChannelSummary(feedUrl);
  return summary ?? currentSummary;
};

const mergeEpisodeDescriptions = (
  episodes: PodcastDetail['episodes'],
  descriptions: FeedItemDescriptionMap,
): PodcastDetail['episodes'] => {
  if (descriptions.size === 0) {
    return episodes;
  }

  return episodes.map((episode) => {
    const match = episode.guid ? descriptions.get(episode.guid) : descriptions.get(episode.id);
    return match ? { ...episode, description: match } : episode;
  });
};

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
    const feedUrl = resolveFeedUrl(response.results ?? []);

    if (!feedUrl) {
      return detail;
    }

    const [summary, descriptions] = await Promise.all([
      enrichPodcastSummary(detail.podcast.summary, feedUrl, this.feedClient),
      this.feedClient.fetchItemDescriptions(feedUrl),
    ]);

    return {
      ...detail,
      podcast: {
        ...detail.podcast,
        summary,
      },
      episodes: mergeEpisodeDescriptions(detail.episodes, descriptions),
    };
  }
}
