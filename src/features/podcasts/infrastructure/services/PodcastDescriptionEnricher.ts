import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import {
  FeedContentClient,
  type FeedItemDescriptionMap,
} from '@podcasts/infrastructure/api/FeedContentClient';
import { DEFAULT_PODCAST_SUMMARY } from '@podcasts/infrastructure/mappers/mapperConstants';

/**
 * Service that enriches podcast details with additional information from RSS feeds.
 * Fetches and merges podcast summaries and episode descriptions from RSS feeds
 * to provide more complete information than what is available in the API.
 */
export class PodcastDescriptionEnricher {
  /**
   * Creates an instance of the podcast description enricher.
   *
   * @param feedClient Client that fetches content from RSS feeds.
   */
  constructor(private readonly feedClient: FeedContentClient = new FeedContentClient()) {}

  /**
   * Enriches the provided podcast detail with information from RSS feeds.
   * Only fetches feed data if a feed URL is provided.
   * Replaces default summaries with feed summaries when available.
   * Merges episode descriptions from the feed with existing episode data.
   *
   * @param detail Podcast detail obtained from the API lookup.
   * @param feedUrl Optional RSS feed URL associated with the podcast.
   * @returns Promise that resolves to an enriched podcast detail with feed-based information.
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
