import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { PodcastList } from '@podcasts/presentation/components/PodcastList';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('PodcastList', () => {
  it('renders a grid of podcast cards', () => {
    render(
      <MemoryRouter>
        <PodcastList podcasts={MOCK_PODCASTS} />
      </MemoryRouter>,
    );

    const grid = screen.getByTestId('podcast-list');
    expect(grid).toBeInTheDocument();
    expect(screen.getAllByTestId('podcast-card')).toHaveLength(MOCK_PODCASTS.length);
    expect(screen.getByText(MOCK_PODCASTS[0].title)).toBeInTheDocument();
    expect(screen.getByText(`Author: ${MOCK_PODCASTS[0].author}`)).toBeInTheDocument();
  });

  it('renders an empty state when there are no podcasts', () => {
    render(
      <MemoryRouter>
        <PodcastList podcasts={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/no podcasts found/i)).toBeInTheDocument();
  });
});
