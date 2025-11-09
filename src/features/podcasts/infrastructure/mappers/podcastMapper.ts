import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { TopPodcastsResponse } from '@podcasts/infrastructure/api/ITunesPodcastClient';

interface FeedEntry {
  id?: {
    attributes?: Record<string, string | undefined>;
  };
  ['im:name']?: {
    label?: string;
  };
  ['im:artist']?: {
    label?: string;
  };
  ['im:image']?: Array<{
    label?: string;
  }>;
  summary?: {
    label?: string;
  };
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/300';

const getPodcastId = (entry: FeedEntry): string => entry.id?.attributes?.['im:id'] ?? 'unknown-id';

const getImageUrl = (entry: FeedEntry): string =>
  entry['im:image']?.[2]?.label ?? entry['im:image']?.[0]?.label ?? FALLBACK_IMAGE;

const toPodcast = (entry: FeedEntry): Podcast => ({
  id: getPodcastId(entry),
  title: entry['im:name']?.label ?? 'Unknown podcast',
  author: entry['im:artist']?.label ?? 'Unknown author',
  imageUrl: getImageUrl(entry),
  summary: entry.summary?.label ?? 'Description not available.',
});

/**
 * Maps the iTunes RSS feed response to the domain podcast entity list.
 */
export const mapToPodcastList = (response: TopPodcastsResponse): Podcast[] => {
  const entries = response.feed?.entry ?? [];
  return entries.map((entry) => toPodcast(entry as FeedEntry));
};
