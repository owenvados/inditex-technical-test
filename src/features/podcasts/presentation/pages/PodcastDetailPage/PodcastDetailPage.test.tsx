import { PodcastDetailPage } from '@podcasts/presentation/pages/PodcastDetailPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('PodcastDetailPage', () => {
  it('renders podcast detail information based on the route parameter', () => {
    render(
      <MemoryRouter initialEntries={['/podcast/abc123']}>
        <Routes>
          <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/displaying information for podcast abc123/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to podcasts/i })).toBeInTheDocument();
  });
});
