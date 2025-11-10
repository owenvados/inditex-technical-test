import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { renderHook } from '@testing-library/react';

import { useFilteredPodcasts } from '../hooks/useFilteredPodcasts';

jest.mock('../hooks/useTopPodcasts', () => ({
  useTopPodcasts: jest.fn(),
}));

jest.mock('@shared/hooks/useDebounce', () => ({
  useDebounce: <T,>(value: T) => value,
}));

const mockUseTopPodcasts = jest.requireMock('../hooks/useTopPodcasts')
  .useTopPodcasts as jest.Mock;

describe('useFilteredPodcasts', () => {
  beforeEach(() => {
    mockUseTopPodcasts.mockReturnValue({
      podcasts: MOCK_PODCASTS,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns all podcasts when the search term is empty', () => {
    const { result } = renderHook(() => useFilteredPodcasts(''));

    expect(result.current.podcasts).toEqual(MOCK_PODCASTS);
    expect(result.current.filteredCount).toBe(MOCK_PODCASTS.length);
    expect(result.current.totalCount).toBe(MOCK_PODCASTS.length);
    expect(result.current.isLoading).toBe(false);
  });

  it('filters podcasts based on the provided search term', () => {
    const { result } = renderHook(() => useFilteredPodcasts('kexp'));

    expect(result.current.filteredCount).toBe(1);
    expect(result.current.podcasts[0].title).toContain('KEXP');
  });
});


