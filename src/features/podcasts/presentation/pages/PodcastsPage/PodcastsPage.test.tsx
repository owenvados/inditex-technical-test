import { PodcastsPage } from '@podcasts/presentation/pages/PodcastsPage';
import { render, screen } from '@testing-library/react';

describe('PodcastsPage', () => {
  it('renders the podcasts heading', () => {
    render(<PodcastsPage />);

    expect(screen.getByRole('heading', { name: /podcasts/i })).toBeInTheDocument();
  });
});
