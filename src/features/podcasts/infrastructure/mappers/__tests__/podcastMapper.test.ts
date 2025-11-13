import {
  mapToPodcastDetail,
  mapToPodcastList,
} from '@podcasts/infrastructure/mappers/podcastMapper';

const createFeedEntry = (overrides: Record<string, unknown> = {}) =>
  ({
    id: { attributes: { 'im:id': 'feed-id' } },
    'im:name': { label: 'Feed title' },
    'im:artist': { label: 'Feed author' },
    'im:image': [
      { label: 'https://cdn.example.com/img-small.png' },
      { label: 'https://cdn.example.com/img-medium.png' },
      { label: 'https://cdn.example.com/img-large.png' },
    ],
    summary: { label: 'Feed summary' },
    ...overrides,
  }) as unknown;

const createLookupResponse = (overrides: Record<string, unknown> = {}) => ({
  resultCount: 2,
  results: [
    {
      collectionId: 100,
      collectionName: 'Collection title',
      trackName: 'Track title',
      artistName: 'Artist name',
      artworkUrl600: 'https://cdn.example.com/artwork600.png',
      artworkUrl100: 'https://cdn.example.com/artwork100.png',
      description: 'Collection description',
      ...overrides,
    },
    {
      trackId: 200,
      trackName: 'Episode title',
      episodeUrl: 'https://cdn.example.com/episode.mp3',
      releaseDate: '2025-11-08T06:16:06Z',
      trackTimeMillis: 3600000,
      episodeGuid: 'guid-200',
    },
  ],
});

describe('podcastMapper', () => {
  it('maps feed entries into podcasts', () => {
    const response = {
      feed: {
        entry: [createFeedEntry(), createFeedEntry({ id: { attributes: { 'im:id': 'another' } } })],
      },
    };

    const podcasts = mapToPodcastList(response);

    expect(podcasts).toHaveLength(2);
    expect(podcasts[0]).toMatchObject({
      id: 'feed-id',
      title: 'Feed title',
      author: 'Feed author',
      imageUrl: 'https://cdn.example.com/img-large.png',
      summary: 'Feed summary',
    });
  });

  it('maps lookup response into podcast detail with episodes', () => {
    const detail = mapToPodcastDetail(createLookupResponse());

    expect(detail).toMatchObject({
      podcast: {
        id: '100',
        title: 'Collection title',
        author: 'Artist name',
        imageUrl: 'https://cdn.example.com/artwork600.png',
        summary: 'Collection description',
      },
      episodes: expect.any(Array),
    });

    expect(detail.episodes).toHaveLength(1);
    expect(detail.episodes[0]).toMatchObject({
      id: '200',
      title: 'Episode title',
      audioUrl: 'https://cdn.example.com/episode.mp3',
      guid: 'guid-200',
      duration: expect.any(Object),
    });
    expect(detail.episodes[0].duration.toMilliseconds()).toBe(3600000);
  });

  it('throws when lookup response has no results', () => {
    expect(() => mapToPodcastDetail({ resultCount: 0, results: [] })).toThrow('Podcast not found');
  });
});
