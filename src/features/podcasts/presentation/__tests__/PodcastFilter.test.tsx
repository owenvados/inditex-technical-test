import PodcastFilter from '@podcasts/presentation/components/PodcastFilter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PodcastFilter', () => {
  it('shows the current count and search term', () => {
    render(
      <PodcastFilter filteredCount={42} searchTerm="rock" onSearchTermChange={jest.fn()} />,
    );

    expect(screen.getByTestId('podcast-count')).toHaveTextContent('42');
    expect(screen.getByPlaceholderText(/filter podcasts/i)).toHaveValue('rock');
  });

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


