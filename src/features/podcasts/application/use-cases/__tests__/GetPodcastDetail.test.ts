import type { Episode } from '@podcasts/domain/entities/Episode';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';
import { Duration } from '@podcasts/domain/value-objects/Duration';

import { GetPodcastDetail } from '../GetPodcastDetail';

describe('GetPodcastDetail use case', () => {
  const podcast: Podcast = {
    id: 'pod-1',
    title: 'Music Podcast',
    author: 'Host',
    imageUrl: 'image',
    summary: 'Summary',
  };

  const episodes: Episode[] = [
    {
      id: 'ep-1',
      title: 'Episode 1',
      description: 'Desc 1',
      audioUrl: 'audio-1',
      publishedAt: new Date('2023-01-01'),
      duration: new Duration(1_000),
    },
    {
      id: 'ep-2',
      title: 'Episode 2',
      description: 'Desc 2',
      audioUrl: 'audio-2',
      publishedAt: new Date('2023-02-01'),
      duration: new Duration(2_000),
    },
  ];

  const repositoryMock: jest.Mocked<IPodcastRepository> = {
    getTopPodcasts: jest.fn(),
    getPodcastDetail: jest.fn<Promise<PodcastDetail>, [string]>().mockResolvedValue({
      podcast,
      episodes: [...episodes].reverse(),
    }),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the podcast detail with episodes sorted by published date descending', async () => {
    const useCase = new GetPodcastDetail(repositoryMock);

    const detail = await useCase.execute('pod-1');

    expect(repositoryMock.getPodcastDetail).toHaveBeenCalledWith('pod-1');
    expect(detail.episodes[0].id).toBe('ep-2');
    expect(detail.episodes[1].id).toBe('ep-1');
  });

  it('throws an error when the podcast id is missing', async () => {
    const useCase = new GetPodcastDetail(repositoryMock);

    await expect(useCase.execute('')).rejects.toThrow('Podcast ID is required');
  });
});
