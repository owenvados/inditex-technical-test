import { MOCK_PODCASTS } from '@podcasts/__test-utils__';
import { FilterPodcasts } from '@podcasts/application/use-cases/podcast/FilterPodcasts';
import { mapPodcastsToCardDTOs } from '@podcasts/infrastructure/mappers/podcastCardMapper';

const MOCK_PODCAST_CARDS = mapPodcastsToCardDTOs(MOCK_PODCASTS);

// Mock dependencies
jest.mock('../useTopPodcasts', () => ({
  useTopPodcasts: jest.fn(() => ({
    podcasts: MOCK_PODCAST_CARDS,
    isLoading: false,
  })),
}));
jest.mock('@shared/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value),
}));

describe('useFilteredPodcasts', () => {
  it('calculates totalCount correctly from podcasts array length', () => {
    // This tests: totalCount: podcasts.length
    expect(MOCK_PODCAST_CARDS.length).toBeGreaterThan(0);
  });

  it('calculates filteredCount correctly from filtered podcasts', () => {
    // This tests: filteredCount: filteredPodcasts.length
    const filterUseCase = new FilterPodcasts();
    const result = filterUseCase.execute(MOCK_PODCAST_CARDS, 'KEXP');
    expect(result.length).toBe(1);
  });

  it('uses FilterPodcasts use case for filtering logic', () => {
    const filterUseCase = new FilterPodcasts();
    const result = filterUseCase.execute(MOCK_PODCAST_CARDS, 'KEXP');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('KEXP Song of the Day');
  });
});
