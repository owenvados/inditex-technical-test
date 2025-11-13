import { Duration } from '@podcasts/domain/value-objects/Duration';
import {
  type PodcastEpisodeRecord,
  mapEpisodeFromLookup,
  mapEpisodesFromLookupRecords,
} from '@podcasts/infrastructure/mappers/episodeMapper';

const createEpisodeRecord = (
  overrides: Partial<PodcastEpisodeRecord> = {},
): PodcastEpisodeRecord => ({
  trackId: 123,
  trackName: 'Sample track',
  description: 'Long description',
  shortDescription: 'Short description',
  episodeUrl: 'https://cdn.example.com/audio.mp3',
  releaseDate: '2025-11-08T06:16:06Z',
  trackTimeMillis: 3600000,
  episodeGuid: 'guid',
  ...overrides,
});

describe('episodeMapper', () => {
  it('maps a lookup record to Episode using trackId as identifier', () => {
    const result = mapEpisodeFromLookup(createEpisodeRecord());

    expect(result).toMatchObject({
      id: '123',
      title: 'Sample track',
      description: 'Long description',
      guid: 'guid',
      audioUrl: 'https://cdn.example.com/audio.mp3',
      duration: expect.any(Duration),
      publishedAt: expect.any(Date),
    });
    expect(result.duration.toMilliseconds()).toBe(3600000);
  });

  it('falls back to episodeGuid when trackId is missing', () => {
    const record = createEpisodeRecord({ trackId: undefined, episodeGuid: 'episode-guid' });

    const result = mapEpisodeFromLookup(record);

    expect(result.id).toBe('episode-guid');
    expect(result.guid).toBe('episode-guid');
  });

  it('falls back to default values when metadata is missing', () => {
    const record = createEpisodeRecord({
      trackId: undefined,
      episodeGuid: undefined,
      trackName: undefined,
      description: undefined,
      shortDescription: undefined,
      episodeUrl: undefined,
      previewUrl: undefined,
      releaseDate: undefined,
      trackTimeMillis: undefined,
    });

    const result = mapEpisodeFromLookup(record);

    expect(result.id).toBe('missing-episode-id');
    expect(result.title).toBe('Untitled episode');
    expect(result.description).toBe('Description not available.');
    expect(result.guid).toBeUndefined();
    expect(result.audioUrl).toBe('');
    expect(result.publishedAt).toBeInstanceOf(Date);
    expect(result.duration).toBeInstanceOf(Duration);
    expect(result.duration.toMilliseconds()).toBe(0);
  });

  it('maps collections of lookup records', () => {
    const records = [createEpisodeRecord({ trackId: 1 }), createEpisodeRecord({ trackId: 2 })];

    const episodes = mapEpisodesFromLookupRecords(records);

    expect(episodes).toHaveLength(2);
    expect(episodes.map((episode) => episode.id)).toEqual(['1', '2']);
  });
});
