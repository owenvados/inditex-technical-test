import { MOCK_EPISODES } from '@podcasts/presentation/__mocks__/podcastMocks';
import { EpisodeList } from '@podcasts/presentation/components/EpisodeList';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('EpisodeList', () => {
  it('renders episodes in a table', () => {
    render(
      <MemoryRouter>
        <EpisodeList episodes={MOCK_EPISODES} podcastId="mock-podcast" />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('episode-list')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(MOCK_EPISODES.length + 1);
    expect(screen.getByText(MOCK_EPISODES[0].title)).toBeInTheDocument();
  });

  it('renders empty state when no episodes available', () => {
    render(
      <MemoryRouter>
        <EpisodeList episodes={[]} podcastId="mock-podcast" />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('episode-empty-state')).toBeInTheDocument();
  });
});
