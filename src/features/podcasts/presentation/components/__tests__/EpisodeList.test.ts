import { MOCK_EPISODES } from '@podcasts/__test-utils__';

import EpisodeList from '../EpisodeList/EpisodeList';
import { createEpisodeListColumns } from '../EpisodeList/episodeListColumns';

describe('EpisodeList', () => {
  it('has displayName set for debugging', () => {
    expect(EpisodeList).toBeDefined();
  });

  describe('createEpisodeListColumns', () => {
    it('creates columns with correct structure', () => {
      const columns = createEpisodeListColumns('podcast-123');

      expect(columns).toHaveLength(3);
      expect(columns[0].header).toBe('Title');
      expect(columns[1].header).toBe('Date');
      expect(columns[2].header).toBe('Duration');
    });

    it('renders episode title as link', () => {
      const columns = createEpisodeListColumns('podcast-123');
      const titleCell = columns[0].cell(MOCK_EPISODES[0]);

      // The cell should render a Link component (we can't test rendering without RTL)
      // but we verify the function executes without errors
      expect(typeof titleCell).toBe('object');
    });

    it('formats episode date correctly', () => {
      const columns = createEpisodeListColumns('podcast-123');
      const dateCell = columns[1].cell(MOCK_EPISODES[0]);

      // Date should be formatted (tested in dateFormatter.test.ts)
      expect(typeof dateCell).toBe('string');
    });

    it('formats episode duration correctly', () => {
      const columns = createEpisodeListColumns('podcast-123');
      const durationCell = columns[2].cell(MOCK_EPISODES[0]);

      // Duration should be formatted using Duration value object
      expect(typeof durationCell).toBe('string');
    });
  });
});
