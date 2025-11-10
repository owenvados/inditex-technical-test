import { MOCK_PODCAST_DETAIL } from '@podcasts/presentation/__mocks__/podcastMocks';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { EpisodeDetailPage } from '@podcasts/presentation/pages/EpisodeDetailPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('@podcasts/presentation/hooks/usePodcastDetail');

const mockedUsePodcastDetail = usePodcastDetail as jest.MockedFunction<typeof usePodcastDetail>;

const renderPage = (path = '/podcast/79687345/episode/episode-1') => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('EpisodeDetailPage', () => {
  it('renders episode detail when data is available', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastDetail: MOCK_PODCAST_DETAIL,
      isLoading: false,
    });

    renderPage();

    expect(screen.getByTestId('episode-detail-page')).toBeInTheDocument();
    expect(screen.getByText('Episode One')).toBeInTheDocument();
  });

  it('renders nothing while loading', () => {
    mockedUsePodcastDetail.mockReturnValue({ podcastDetail: null, isLoading: true });

    const { container } = renderPage();

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when episode is missing', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastDetail: { podcast: MOCK_PODCAST_DETAIL.podcast, episodes: [] },
      isLoading: false,
    });

    const { container } = renderPage();

    expect(container.firstChild).toBeNull();
  });
});
