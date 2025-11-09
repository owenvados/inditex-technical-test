import './EpisodeList.css';

type EpisodeRow = {
  id: string;
  title: string;
  publishedAt: string;
  durationMinutes: number;
};

const SAMPLE_EPISODES: EpisodeRow[] = [
  { id: 'episode-1', title: 'Sample Episode 1', publishedAt: '2025-01-01', durationMinutes: 30 },
  { id: 'episode-2', title: 'Sample Episode 2', publishedAt: '2025-01-08', durationMinutes: 29 },
  { id: 'episode-3', title: 'Sample Episode 3', publishedAt: '2025-01-15', durationMinutes: 32 },
];

const formatDate = (dateIso: string): string => dateIso;

const formatDuration = (durationMinutes: number): string => {
  return `${durationMinutes.toString().padStart(2, '0')}:00`;
};

/**
 * Table that displays a list of sample podcast episodes.
 *
 * @returns {JSX.Element} The episodes table with title, date and duration columns.
 */
export const EpisodeList: React.FC = () => {
  if (SAMPLE_EPISODES.length === 0) {
    return <div className="empty-state">No episodes available</div>;
  }

  return (
    <div className="episode-list" data-testid="episode-list">
      <table className="episode-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_EPISODES.map((episode) => (
            <tr key={episode.id} className="episode-row">
              <td className="episode-title-cell">{episode.title}</td>
              <td className="episode-date">{formatDate(episode.publishedAt)}</td>
              <td className="episode-duration">{formatDuration(episode.durationMinutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

EpisodeList.displayName = 'EpisodeList';

export default EpisodeList;
