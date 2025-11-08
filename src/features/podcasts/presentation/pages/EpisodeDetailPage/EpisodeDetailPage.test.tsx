import { EpisodeDetailPage } from '@podcasts/presentation/pages/EpisodeDetailPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('EpisodeDetailPage', () => {
  it('renders episode detail content using route params', () => {
    render(
      <MemoryRouter initialEntries={['/podcast/abc123/episode/ep456']}>
        <Routes>
          <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/displaying episode ep456 associated with podcast abc123/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to podcast detail/i })).toBeInTheDocument();
  });
});
