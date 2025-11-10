import React from 'react';

import './PodcastFilter.css';

export interface PodcastFilterProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  filteredCount: number;
}

/**
 * Renders the podcasts filter section with a badge and search input.
 *
 * @param props Component properties containing search state and callbacks.
 * @returns A filter section ready to be reused across pages.
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
      <span className="podcast-filter__badge" data-testid="podcast-count">
        {filteredCount}
      </span>
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
