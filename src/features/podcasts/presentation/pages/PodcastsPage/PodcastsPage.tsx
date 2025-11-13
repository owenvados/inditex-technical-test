import PodcastFilter from '@podcasts/presentation/components/PodcastFilter';
import PodcastList from '@podcasts/presentation/components/PodcastList';
import { useFilteredPodcasts } from '@podcasts/presentation/hooks/useFilteredPodcasts';
import React, { useState } from 'react';

import './PodcastsPage.css';

/**
 * Page component that displays the top podcasts catalogue.
 * Provides a search filter to filter podcasts by title and author.
 * Displays the filtered results. Loading state is handled by the routing fallback.
 *
 * @returns Page component with search filter and podcast grid.
 */
export const PodcastsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { podcasts, filteredCount } = useFilteredPodcasts(searchTerm);

  return (
    <section className="podcasts-page">
      <PodcastFilter
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        filteredCount={filteredCount}
      />
      <PodcastList podcasts={podcasts} />
    </section>
  );
};

PodcastsPage.displayName = 'PodcastsPage';

export default PodcastsPage;
