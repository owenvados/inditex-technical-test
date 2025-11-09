import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { PodcastSidebar } from '@podcasts/presentation/components/PodcastSidebar';
import { render, screen } from '@testing-library/react';

describe('PodcastSidebar', () => {
  it('renders podcast information', () => {
    render(<PodcastSidebar podcast={MOCK_PODCASTS[0]} />);

    expect(screen.getByText(MOCK_PODCASTS[0].title)).toBeInTheDocument();
    expect(screen.getByText(`by ${MOCK_PODCASTS[0].author}`)).toBeInTheDocument();
  });
});
