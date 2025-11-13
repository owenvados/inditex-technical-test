import type { Episode } from '@podcasts/domain/entities/Episode';
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
 * Maps an iTunes API episode record to an episode domain entity.
 * Converts API response format to domain entity with normalized data.
 * Uses default values when API data is missing or invalid.
 *
 * @param episode iTunes API episode record to map.
 * @returns Episode domain entity with normalized data.
 */
export const mapEpisodeFromLookup = (episode: PodcastEpisodeRecord): Episode => ({
  id: resolveEpisodeId(episode),
  title: episode.trackName ?? DEFAULT_EPISODE_TITLE,
  description: resolveDescription(episode),
  guid: resolveEpisodeGuid(episode),
  audioUrl: resolveAudioUrl(episode),
  publishedAt: parseDate(episode.releaseDate),
  durationMs: episode.trackTimeMillis ?? 0,
});

/**
 * Maps an array of iTunes API episode records to episode domain entities.
 * Processes each record through the single episode mapper.
 *
 * @param records Array of iTunes API episode records to map.
 * @returns Array of episode domain entities.
 */
export const mapEpisodesFromLookupRecords = (records: PodcastEpisodeRecord[]): Episode[] =>
  records.map((record) => mapEpisodeFromLookup(record));
