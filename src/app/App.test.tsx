import App from '@app/App';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  it('renders the application header link', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /podcaster/i })).toBeInTheDocument();
  });
});
