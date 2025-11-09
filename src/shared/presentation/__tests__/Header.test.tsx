import Header from '@shared/presentation/components/Header';
import { render, screen } from '@testing-library/react';

describe('Header', () => {
  it('renders the application title link', () => {
    render(<Header />);

    const link = screen.getByRole('link', { name: /podcaster/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
