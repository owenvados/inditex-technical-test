import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import { AppLoadingSpinner } from '@shared/presentation/components/AppLoadingSpinner';
import { render, screen } from '@testing-library/react';

describe('AppLoadingSpinner', () => {
  const renderSpinner = (initialLoading = false) =>
    render(
      <LoadingStateProvider initialLoading={initialLoading}>
        <AppLoadingSpinner dataTestId="global-spinner" />
      </LoadingStateProvider>,
    );

  it('does not render when the application is not loading', () => {
    renderSpinner(false);

    expect(screen.queryByTestId('global-spinner')).not.toBeInTheDocument();
  });

  it('renders when the application is loading', () => {
    renderSpinner(true);

    expect(screen.getByTestId('global-spinner')).toBeInTheDocument();
  });
});
