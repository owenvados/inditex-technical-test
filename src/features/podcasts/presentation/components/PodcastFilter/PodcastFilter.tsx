import Badge from '@shared/presentation/components/Badge';
import React from 'react';

import './PodcastFilter.css';

export interface PodcastFilterProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  filteredCount: number;
}

/**
 * Component that renders a filter section for searching podcasts.
 * Displays a badge with the filtered count and a search input field.
 * Updates the search term in real-time as the user types.
 *
 * @param props Component props containing search term, change handler, and filtered count.
 * @returns Filter section component with search input and count badge.
 */
export const PodcastFilter: React.FC<PodcastFilterProps> = ({
  searchTerm,
  onSearchTermChange,
  filteredCount,
}) => {
  const [inputValue, setInputValue] = React.useState(searchTerm);

  React.useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      setInputValue(nextValue);
      onSearchTermChange(nextValue);
    },
    [onSearchTermChange],
  );

  return (
    <div className="podcast-filter">
      <Badge count={filteredCount} dataTestId="podcast-count" />
      <input
        type="text"
        className="podcast-filter__input"
        placeholder="Filter podcasts..."
        value={inputValue}
        onChange={handleInputChange}
        aria-label="Filter podcasts"
      />
    </div>
  );
};

PodcastFilter.displayName = 'PodcastFilter';

export default PodcastFilter;
