import PodcastFilter from '@podcasts/presentation/components/PodcastFilter';
import PodcastList from '@podcasts/presentation/components/PodcastList';
import { useFilteredPodcasts } from '@podcasts/presentation/hooks/useFilteredPodcasts';
import StatusMessage from '@shared/presentation/components/StatusMessage';
import React, { useState } from 'react';

import './PodcastsPage.css';

/**
 * Page that lists the top podcasts using the catalogue hook.
 *
 * @returns Section showing a loading placeholder or the podcast grid.
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
