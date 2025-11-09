import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { useTopPodcasts } from '@podcasts/presentation/hooks/useTopPodcasts';
import { PodcastsPage } from '@podcasts/presentation/pages/PodcastsPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@podcasts/presentation/hooks/useTopPodcasts');

const mockedUseTopPodcasts = useTopPodcasts as jest.MockedFunction<typeof useTopPodcasts>;

describe('PodcastsPage', () => {
  beforeEach(() => {
    mockedUseTopPodcasts.mockReturnValue({
      podcasts: MOCK_PODCASTS,
      isLoading: false,
    });
  });

  it('renders the podcasts list', () => {
    render(
      <MemoryRouter>
        <PodcastsPage />
      </MemoryRouter>,
    );

    expect(screen.getAllByTestId('podcast-card')).toHaveLength(MOCK_PODCASTS.length);
    expect(screen.getByText(MOCK_PODCASTS[0].title)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockedUseTopPodcasts.mockReturnValueOnce({ podcasts: [], isLoading: true });

    render(
      <MemoryRouter>
        <PodcastsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('podcast-loading')).toBeInTheDocument();
  });
});
