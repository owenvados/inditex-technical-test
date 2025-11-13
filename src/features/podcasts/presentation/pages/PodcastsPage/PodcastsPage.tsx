import PodcastFilter from '@podcasts/presentation/components/PodcastFilter';
import PodcastList from '@podcasts/presentation/components/PodcastList';
import { useFilteredPodcasts } from '@podcasts/presentation/hooks/useFilteredPodcasts';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import React, { useState } from 'react';

import './PodcastsPage.css';

/**
 * Page component that displays the top podcasts catalogue.
 * Provides a search filter to filter podcasts by title and author.
 * Shows a loading state while fetching podcasts and displays the filtered results.
 *
 * @returns Page component with search filter and podcast grid, or loading state.
 */
export const PodcastsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { podcasts, filteredCount, isLoading } = useFilteredPodcasts(searchTerm);

  return (
    <section className="podcasts-page">
      <PodcastFilter
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        filteredCount={filteredCount}
      />
      {isLoading ? (
        <StatusMessage message="Loading podcasts…" dataTestId="podcast-loading" />
      ) : (
        <PodcastList podcasts={podcasts} />
      )}
    </section>
  );
};

PodcastsPage.displayName = 'PodcastsPage';

export default PodcastsPage;
