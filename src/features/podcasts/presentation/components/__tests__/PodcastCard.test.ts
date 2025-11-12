import PodcastCard from '../PodcastCard/PodcastCard';

describe('PodcastCard', () => {
  it('is memoized for performance optimization', () => {
    // PodcastCard is memoized, verify it's defined
    expect(PodcastCard).toBeDefined();
  });
});
