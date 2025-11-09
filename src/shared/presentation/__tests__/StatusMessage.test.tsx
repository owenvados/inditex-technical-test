import StatusMessage from '@shared/presentation/components/StatusMessage';
import { render, screen } from '@testing-library/react';

describe('StatusMessage', () => {
  it('renders the provided message', () => {
    render(<StatusMessage message="Nothing to display" dataTestId="status-message" />);

    expect(screen.getByTestId('status-message')).toHaveTextContent('Nothing to display');
  });

  it('renders children when provided', () => {
    render(
      <StatusMessage message="No data">
        <button type="button">Retry</button>
      </StatusMessage>,
    );

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
