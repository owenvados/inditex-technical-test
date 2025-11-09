import { Sidebar } from '@shared/presentation/components/Sidebar';
import { render, screen } from '@testing-library/react';

describe('Sidebar', () => {
  it('renders provided children', () => {
    render(
      <Sidebar>
        <p data-testid="sidebar-child">Sidebar content</p>
      </Sidebar>,
    );

    expect(screen.getByTestId('sidebar-child')).toHaveTextContent('Sidebar content');
    expect(screen.getByTestId('sidebar-child').closest('aside')).not.toBeNull();
  });
});
