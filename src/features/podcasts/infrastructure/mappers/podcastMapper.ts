import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type {
  PodcastLookupResponse,
  TopPodcastsResponse,
} from '@podcasts/infrastructure/api/ITunesPodcastClient';
import type { PodcastEpisodeRecord } from '@podcasts/infrastructure/mappers/episodeMapper';
import { mapEpisodesFromLookupRecords } from '@podcasts/infrastructure/mappers/episodeMapper';
import {
  DEFAULT_PODCAST_AUTHOR,
  DEFAULT_PODCAST_ID,
  DEFAULT_PODCAST_SUMMARY,
  DEFAULT_PODCAST_TITLE,
  FALLBACK_PODCAST_IMAGE,
} from '@podcasts/infrastructure/mappers/mapperConstants';

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
  ['itunes:summary']?: {
    label?: string;
  };
  description?: {
    label?: string;
  };
}

interface PodcastLookupRecord {
  collectionId?: number;
  collectionName?: string;
  trackName?: string;
  artistName?: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  description?: string;
}

const resolvePodcastId = (record: PodcastLookupRecord): string =>
  String(record.collectionId ?? record.trackName ?? DEFAULT_PODCAST_ID);

const resolveFeedId = (entry: FeedEntry): string =>
  entry.id?.attributes?.['im:id'] ?? DEFAULT_PODCAST_ID;

const resolveTitle = (entry: FeedEntry): string => entry['im:name']?.label ?? DEFAULT_PODCAST_TITLE;

const resolveAuthor = (entry: FeedEntry): string =>
  entry['im:artist']?.label ?? DEFAULT_PODCAST_AUTHOR;

type SummaryField = { label?: string } | string | null | undefined;

const extractSummaryValue = (field: SummaryField): string | undefined => {
  if (!field) {
    return undefined;
  }

  if (typeof field === 'string') {
    const trimmed = field.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  const label = field.label?.trim();
  return label && label.length > 0 ? label : undefined;
};

const resolveSummary = (entry: FeedEntry): string => {
  const candidates: SummaryField[] = [entry.summary, entry['itunes:summary'], entry.description];

  for (const candidate of candidates) {
    const value = extractSummaryValue(candidate);
    if (value) {
      return value;
    }
  }

  return DEFAULT_PODCAST_SUMMARY;
};

const resolveImageUrl = (entry: FeedEntry): string =>
  entry['im:image']?.[2]?.label ?? entry['im:image']?.[0]?.label ?? FALLBACK_PODCAST_IMAGE;

const resolveDetailImageUrl = (record: PodcastLookupRecord): string =>
  record.artworkUrl600 ?? record.artworkUrl100 ?? FALLBACK_PODCAST_IMAGE;

const resolveDetailTitle = (record: PodcastLookupRecord): string =>
  record.collectionName ?? record.trackName ?? DEFAULT_PODCAST_TITLE;

const resolveDetailAuthor = (record: PodcastLookupRecord): string =>
  record.artistName ?? DEFAULT_PODCAST_AUTHOR;

const resolveDetailSummary = (record: PodcastLookupRecord): string =>
  record.description ?? DEFAULT_PODCAST_SUMMARY;

/**
 * Maps a feed entry into the domain {@link Podcast} entity.
 */
const mapFeedEntryToPodcast = (entry: FeedEntry): Podcast => ({
  id: resolveFeedId(entry),
  title: resolveTitle(entry),
  author: resolveAuthor(entry),
  imageUrl: resolveImageUrl(entry),
  summary: resolveSummary(entry),
});

/**
 * Converts RSS feed data to domain podcasts.
 */
export const mapToPodcastList = (response: TopPodcastsResponse): Podcast[] => {
  const entries = response.feed?.entry ?? [];
  return entries.map((entry) => mapFeedEntryToPodcast(entry as FeedEntry));
};

/**
 * Combines podcast lookup metadata and episodes into the {@link PodcastDetail} aggregate.
 */
export const mapToPodcastDetail = (apiResponse: PodcastLookupResponse): PodcastDetail => {
  const results = (apiResponse.results ?? []) as PodcastLookupRecord[];

  if (results.length === 0) {
    throw new Error('Podcast not found');
  }

  const [podcastRecord, ...episodeRecords] = results;
  const podcast: Podcast = {
    id: resolvePodcastId(podcastRecord),
    title: resolveDetailTitle(podcastRecord),
    author: resolveDetailAuthor(podcastRecord),
    imageUrl: resolveDetailImageUrl(podcastRecord),
    summary: resolveDetailSummary(podcastRecord),
  };

  const episodes = mapEpisodesFromLookupRecords(episodeRecords as PodcastEpisodeRecord[]);

  return { podcast, episodes };
};
