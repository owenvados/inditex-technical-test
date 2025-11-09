import type { Episode } from '@podcasts/domain/entities/Episode';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type {
  PodcastLookupResponse,
  TopPodcastsResponse,
} from '@podcasts/infrastructure/api/ITunesPodcastClient';

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

/**
 * Extracts the podcast identifier from the RSS feed entry.
 */
const getPodcastId = (entry: FeedEntry): string => entry.id?.attributes?.['im:id'] ?? 'unknown-id';

/**
 * Retrieves the podcast artwork URL, falling back to a placeholder if missing.
 */
const getImageUrl = (entry: FeedEntry): string =>
  entry['im:image']?.[2]?.label ?? entry['im:image']?.[0]?.label ?? FALLBACK_IMAGE;

/**
 * Maps an RSS feed entry into the domain `Podcast` entity.
 */
const toPodcast = (entry: FeedEntry): Podcast => ({
  id: getPodcastId(entry),
  title: entry['im:name']?.label ?? 'Unknown podcast',
  author: entry['im:artist']?.label ?? 'Unknown author',
  imageUrl: getImageUrl(entry),
  summary: entry.summary?.label ?? 'Description not available.',
});

interface PodcastLookupRecord {
  collectionId?: number;
  collectionName?: string;
  trackName?: string;
  artistName?: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  description?: string;
}

interface PodcastEpisodeRecord {
  trackId?: number;
  trackName?: string;
  description?: string;
  shortDescription?: string;
  episodeUrl?: string;
  previewUrl?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
  episodeGuid?: string;
}

/**
 * Builds a safe Date instance from the API response.
 */
const getSafeDate = (value?: string): Date => {
  const parsed = value ? new Date(value) : undefined;
  return parsed && !Number.isNaN(parsed.valueOf()) ? parsed : new Date(0);
};

/**
 * Returns the best available description for a podcast episode.
 */
const getEpisodeDescription = (episode: PodcastEpisodeRecord): string =>
  episode.description ?? episode.shortDescription ?? 'Description not available.';

/**
 * Returns the preferred audio URL for a podcast episode.
 */
const getEpisodeAudio = (episode: PodcastEpisodeRecord): string =>
  episode.episodeUrl ?? episode.previewUrl ?? '';

/**
 * Maps an episode record from the lookup response to the domain `Episode` entity.
 */
const mapLookupEpisodeToDomain = (episode: PodcastEpisodeRecord, index: number): Episode => ({
  id: String(episode.episodeGuid ?? episode.trackId ?? `episode-${index}`),
  title: episode.trackName ?? 'Untitled episode',
  description: getEpisodeDescription(episode),
  audioUrl: getEpisodeAudio(episode),
  publishedAt: getSafeDate(episode.releaseDate),
  durationMs: episode.trackTimeMillis ?? 0,
});

/**
 * Maps the podcast lookup record and its episodes into the domain `PodcastDetail` aggregate.
 */
const mapLookupPodcastToDomain = (
  podcastRecord: PodcastLookupRecord,
  episodeRecords: PodcastEpisodeRecord[],
): PodcastDetail => {
  const podcast: Podcast = {
    id: String(podcastRecord.collectionId ?? podcastRecord.trackName ?? 'unknown-podcast'),
    title: podcastRecord.collectionName ?? podcastRecord.trackName ?? 'Unknown podcast',
    author: podcastRecord.artistName ?? 'Unknown author',
    imageUrl: podcastRecord.artworkUrl600 ?? podcastRecord.artworkUrl100 ?? FALLBACK_IMAGE,
    summary: podcastRecord.description ?? 'Description not available.',
  };

  const episodes = episodeRecords.map((record, index) => mapLookupEpisodeToDomain(record, index));

  return { podcast, episodes };
};

/**
 * Maps the iTunes RSS feed response to the domain podcast entity list.
 */
export const mapToPodcastList = (response: TopPodcastsResponse): Podcast[] => {
  const entries = response.feed?.entry ?? [];
  return entries.map((entry) => toPodcast(entry as FeedEntry));
};

/**
 * Maps the lookup API response to a podcast detail aggregate.
 */
export const mapToPodcastDetail = (apiResponse: PodcastLookupResponse): PodcastDetail => {
  const results = (apiResponse.results ?? []) as PodcastLookupRecord[];

  if (results.length === 0) {
    throw new Error('Podcast not found');
  }

  const [podcastRecord, ...episodeRecords] = results;
  return mapLookupPodcastToDomain(podcastRecord, episodeRecords as PodcastEpisodeRecord[]);
};

/**
 * Maps the lookup API response to an array of episodes only.
 */
export const mapToEpisodeList = (episodesData: unknown[]): Episode[] =>
  (episodesData as PodcastEpisodeRecord[]).map((record, index) =>
    mapLookupEpisodeToDomain(record, index),
  );
