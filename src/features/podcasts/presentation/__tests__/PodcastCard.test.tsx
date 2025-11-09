import { PodcastCard } from '@podcasts/presentation/components/PodcastCard';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const samplePodcast = {
  id: 'pod-1',
  title: 'The React Show',
  author: 'Jane Doe',
  imageUrl: 'https://via.placeholder.com/300',
  summary: 'Deep dives into the React ecosystem.',
};

describe('PodcastCard', () => {
  it('renders podcast information', () => {
    render(
      <MemoryRouter>
        <PodcastCard podcast={samplePodcast} />
      </MemoryRouter>,
    );

    expect(screen.getByText(samplePodcast.title)).toBeInTheDocument();
    expect(screen.getByText(`Author: ${samplePodcast.author}`)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: samplePodcast.title })).toBeInTheDocument();
    expect(screen.getByTestId('podcast-card-link')).toHaveAttribute('href', '/podcast/pod-1');
  });
});
