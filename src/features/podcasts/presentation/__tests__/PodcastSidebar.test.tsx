import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('PodcastSidebar', () => {
  it('renders podcast information', () => {
    render(
      <MemoryRouter>
        <PodcastSidebar podcast={MOCK_PODCASTS[0]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(MOCK_PODCASTS[0].title)).toBeInTheDocument();
    expect(screen.getByText(`by ${MOCK_PODCASTS[0].author}`)).toBeInTheDocument();
    const link = screen.getByTestId('podcast-sidebar-link');
    expect(link).toHaveAttribute('href', `/podcast/${MOCK_PODCASTS[0].id}`);
  });
});
