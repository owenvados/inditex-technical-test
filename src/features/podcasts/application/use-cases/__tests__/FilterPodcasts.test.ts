import type { Podcast } from '@podcasts/domain/entities/Podcast';

import { FilterPodcasts } from '../FilterPodcasts';

const SAMPLE_PODCASTS: Podcast[] = [
  {
    id: '1',
    title: 'All Songs Considered',
    author: 'NPR',
    imageUrl: 'image-1',
    summary: 'Sample summary 1',
  },
  {
    id: '2',
    title: 'KEXP Song of the Day',
    author: 'KEXP',
    imageUrl: 'image-2',
    summary: 'Sample summary 2',
  },
];

describe('FilterPodcasts use case', () => {
  const useCase = new FilterPodcasts();

  it('returns the original list when the search term is empty', () => {
    const result = useCase.execute(SAMPLE_PODCASTS, '');

    expect(result).toEqual(SAMPLE_PODCASTS);
  });

  it('filters podcasts by title or author using a case-insensitive comparison', () => {
    const result = useCase.execute(SAMPLE_PODCASTS, 'kexp');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(SAMPLE_PODCASTS[1]);
  });
});
