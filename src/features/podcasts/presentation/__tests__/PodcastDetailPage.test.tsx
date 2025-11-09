import { MOCK_PODCAST_DETAIL } from '@podcasts/presentation/__mocks__/podcastMocks';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { PodcastDetailPage } from '@podcasts/presentation/pages/PodcastDetailPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('@podcasts/presentation/hooks/usePodcastDetail');

type UsePodcastDetailState = ReturnType<typeof usePodcastDetail>;
const mockedUsePodcastDetail = usePodcastDetail as jest.MockedFunction<typeof usePodcastDetail>;

const createState = (state: Partial<UsePodcastDetailState>): UsePodcastDetailState => ({
  podcastDetail: null,
  isLoading: false,
  ...state,
});

describe('PodcastDetailPage', () => {
  const renderPage = (initialPath = '/podcast/79687345') => {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders podcast detail when data is loaded', () => {
    mockedUsePodcastDetail.mockReturnValue(
      createState({ podcastDetail: MOCK_PODCAST_DETAIL, isLoading: false }),
    );

    renderPage();

    expect(screen.getByTestId('podcast-detail-page')).toBeInTheDocument();
    expect(
      screen.getByText(`Episodes: ${MOCK_PODCAST_DETAIL.episodes.length}`),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_PODCAST_DETAIL.podcast.title)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockedUsePodcastDetail.mockReturnValue(createState({ isLoading: true }));

    renderPage();

    expect(screen.getByTestId('podcast-detail-loading')).toBeInTheDocument();
  });

  it('renders empty state when detail is not available', () => {
    mockedUsePodcastDetail.mockReturnValue(createState({}));

    renderPage();

    expect(screen.getByTestId('podcast-detail-empty')).toBeInTheDocument();
    expect(screen.getByText('Podcast not found.')).toBeInTheDocument();
  });
});
