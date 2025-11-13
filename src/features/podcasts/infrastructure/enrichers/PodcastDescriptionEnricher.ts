import type { PodcastDetail } from '@podcasts/domain/models/aggregate/PodcastDetail';
import {
  FeedContentClient,
  type FeedItemDescriptionMap,
} from '@podcasts/infrastructure/api/FeedContentClient';
import { DEFAULT_PODCAST_SUMMARY } from '@podcasts/infrastructure/mappers/mapperConstants';

/**
 * Enriches podcast details with additional information resolved from RSS feeds.
 */
export class PodcastDescriptionEnricher {
  constructor(private readonly feedClient: FeedContentClient = new FeedContentClient()) {}

  /**
   * Enhances the provided podcast detail with feed metadata when a feed URL is available.
   *
   * @param detail Podcast detail obtained from the lookup API.
   * @param feedUrl Optional RSS feed URL associated with the podcast.
   * @returns Podcast detail including feed-based summary and episode descriptions.
   */
  async enrich(detail: PodcastDetail, feedUrl?: string): Promise<PodcastDetail> {
    if (!feedUrl) {
      return detail;
    }

    const [summary, descriptions] = await Promise.all([
      this.resolveSummary(detail.podcast.summary, feedUrl),
      this.feedClient.fetchItemDescriptions(feedUrl),
    ]);

    return {
      ...detail,
      podcast: {
        ...detail.podcast,
        summary,
      },
      episodes: this.mergeEpisodeDescriptions(detail.episodes, descriptions),
    };
  }

  private async resolveSummary(currentSummary: string, feedUrl: string): Promise<string> {
    if (currentSummary !== DEFAULT_PODCAST_SUMMARY) {
      return currentSummary;
    }

    const summary = await this.feedClient.fetchChannelSummary(feedUrl);
    return summary ?? currentSummary;
  }

  private mergeEpisodeDescriptions(
    episodes: PodcastDetail['episodes'],
    descriptions: FeedItemDescriptionMap,
  ): PodcastDetail['episodes'] {
    if (descriptions.size === 0) {
      return episodes;
    }

    return episodes.map((episode) => {
      const match = episode.guid ? descriptions.get(episode.guid) : descriptions.get(episode.id);
      return match ? { ...episode, description: match } : episode;
    });
  }
}
