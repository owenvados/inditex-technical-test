import { Duration } from '@podcasts/domain/models/episode/Duration';
import type { Episode } from '@podcasts/domain/models/episode/Episode';
import {
  DEFAULT_EPISODE_DESCRIPTION,
  DEFAULT_EPISODE_ID,
  DEFAULT_EPISODE_TITLE,
} from '@podcasts/infrastructure/mappers/mapperConstants';

export interface PodcastEpisodeRecord {
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

const parseDate = (value?: string): Date => {
  const parsed = value ? new Date(value) : undefined;
  return parsed && !Number.isNaN(parsed.valueOf()) ? parsed : new Date(0);
};

const resolveDescription = (episode: PodcastEpisodeRecord): string =>
  episode.description ?? episode.shortDescription ?? DEFAULT_EPISODE_DESCRIPTION;

const resolveAudioUrl = (episode: PodcastEpisodeRecord): string =>
  episode.episodeUrl ?? episode.previewUrl ?? '';

const resolveEpisodeId = (episode: PodcastEpisodeRecord): string =>
  String(episode.trackId ?? episode.episodeGuid ?? DEFAULT_EPISODE_ID);

const resolveEpisodeGuid = (episode: PodcastEpisodeRecord): string | undefined =>
  episode.episodeGuid ?? (episode.trackId ? String(episode.trackId) : undefined);

/**
 * Validates and normalizes a duration value from the API.
 * Returns 0 if the value is invalid (NaN, Infinity, undefined, null, or negative).
 *
 * @param trackTimeMillis Duration in milliseconds from the API.
 * @returns Valid duration in milliseconds (0 if invalid).
 */
const normalizeDuration = (trackTimeMillis: number | undefined): number => {
  if (trackTimeMillis === undefined || trackTimeMillis === null) {
    return 0;
  }

  if (typeof trackTimeMillis !== 'number') {
    return 0;
  }

  if (!Number.isFinite(trackTimeMillis) || Number.isNaN(trackTimeMillis) || trackTimeMillis < 0) {
    return 0;
  }

  return trackTimeMillis;
};

/**
 * Converts a lookup API episode record into the domain {@link Episode} entity.
 */
export const mapEpisodeFromLookup = (episode: PodcastEpisodeRecord): Episode => ({
  id: resolveEpisodeId(episode),
  title: episode.trackName ?? DEFAULT_EPISODE_TITLE,
  description: resolveDescription(episode),
  guid: resolveEpisodeGuid(episode),
  audioUrl: resolveAudioUrl(episode),
  publishedAt: parseDate(episode.releaseDate),
  duration: new Duration(normalizeDuration(episode.trackTimeMillis)),
});

/**
 * Transforms an array of lookup records into domain {@link Episode} entities.
 */
export const mapEpisodesFromLookupRecords = (records: PodcastEpisodeRecord[]): Episode[] =>
  records.map((record) => mapEpisodeFromLookup(record));
