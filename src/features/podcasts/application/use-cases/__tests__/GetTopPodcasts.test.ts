import type { Podcast } from '@podcasts/domain/models/podcast/Podcast';
import type { IPodcastRepository } from '@podcasts/domain/repositories/PodcastRepository';

import { GetTopPodcasts } from '../podcast/GetTopPodcasts';

describe('GetTopPodcasts use case', () => {
  const podcastsMock: Podcast[] = [
    { id: '1', title: 'Podcast 1', author: 'Author 1', imageUrl: 'img-1', summary: 'Summary 1' },
    { id: '2', title: 'Podcast 2', author: 'Author 2', imageUrl: 'img-2', summary: 'Summary 2' },
  ];

  const repositoryMock: jest.Mocked<IPodcastRepository> = {
    getTopPodcasts: jest.fn().mockResolvedValue(podcastsMock),
    getPodcastDetail: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('delegates the call to the repository and returns the podcasts', async () => {
    const useCase = new GetTopPodcasts(repositoryMock);

    const result = await useCase.execute();

    expect(repositoryMock.getTopPodcasts).toHaveBeenCalledTimes(1);
    expect(result).toEqual(podcastsMock);
  });
});
