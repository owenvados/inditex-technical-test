import { render, screen } from '@testing-library/react';

import App from '@app/App';

describe('App', () => {
  it('renders the application header link', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /podcaster/i })).toBeInTheDocument();
  });
});
