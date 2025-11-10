import PodcastFilter from '@podcasts/presentation/components/PodcastFilter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PodcastFilter', () => {
  // Shows the badge and input reflect the given state.
  it('shows the current count and search term', () => {
    render(<PodcastFilter filteredCount={42} searchTerm="rock" onSearchTermChange={jest.fn()} />);

    expect(screen.getByTestId('podcast-count')).toHaveTextContent('42');
    expect(screen.getByPlaceholderText(/filter podcasts/i)).toHaveValue('rock');
  });

  // Notifies the parent callback each time the user types.
  it('notifies the parent when the search term changes', async () => {
    const onSearchTermChange = jest.fn();
    const user = userEvent.setup();

    render(
      <PodcastFilter filteredCount={10} searchTerm="" onSearchTermChange={onSearchTermChange} />,
    );

    await user.type(screen.getByPlaceholderText(/filter podcasts/i), 'news');

    expect(onSearchTermChange).toHaveBeenCalled();
    expect(onSearchTermChange).toHaveBeenLastCalledWith('news');
  });
});
