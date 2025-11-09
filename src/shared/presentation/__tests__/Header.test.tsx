import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import Header from '@shared/presentation/components/Header';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Header', () => {
  it('renders the application title link', () => {
    render(
      <MemoryRouter>
        <LoadingStateProvider>
          <Header />
        </LoadingStateProvider>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /podcaster/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(screen.queryByTestId('app-loading-spinner')).not.toBeInTheDocument();
  });
});
