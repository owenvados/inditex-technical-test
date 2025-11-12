import { MOCK_PODCASTS } from '@podcasts/__test-utils__';

import { FilterPodcasts } from '../FilterPodcasts';

describe('FilterPodcasts use case', () => {
  const useCase = new FilterPodcasts();

  it('returns the original list when the search term is empty', () => {
    const result = useCase.execute(MOCK_PODCASTS, '');

    expect(result).toEqual(MOCK_PODCASTS);
  });

  it('filters podcasts by title or author using a case-insensitive comparison', () => {
    const result = useCase.execute(MOCK_PODCASTS, 'kexp');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(MOCK_PODCASTS[1]);
  });
});
