import type { Episode } from '@podcasts/domain/entities/Episode';
import type { Podcast } from '@podcasts/domain/entities/Podcast';
import type { PodcastDetail } from '@podcasts/domain/entities/PodcastDetail';
import { Duration } from '@podcasts/domain/value-objects/Duration';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300';

export const MOCK_PODCASTS: Podcast[] = [
  {
    id: '79687345',
    title: 'All Songs Considered',
    author: 'NPR',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/c1/f1/14/c1f1145d-1be6-da38-cfe8-ad56419faa94/mza_175438820439487284.jpg/170x170bb.png',
    summary:
      'Weekly conversations from NPR Music exploring the biggest questions in music discovery.',
  },
  {
    id: '12345678',
    title: 'KEXP Song of the Day',
    author: 'KEXP',
    imageUrl: PLACEHOLDER_IMAGE,
    summary: 'Daily song picks spanning indie, rock, electronic and beyond.',
  },
  {
    id: '87654321',
    title: 'Song Exploder',
    author: 'Song Exploder',
    imageUrl: PLACEHOLDER_IMAGE,
    summary: 'Artists break down their songs and tell the story of how they were made.',
  },
];

export const MOCK_EPISODES: Episode[] = [
  {
    id: 'episode-1',
    title: 'Episode One',
    description: 'First episode description.',
    audioUrl: 'https://example.com/audio/episode-1.mp3',
    publishedAt: new Date('2025-01-10T00:00:00Z'),
    duration: new Duration(1_800_000),
  },
  {
    id: 'episode-2',
    title: 'Episode Two',
    description: 'Second episode description.',
    audioUrl: 'https://example.com/audio/episode-2.mp3',
    publishedAt: new Date('2025-01-05T00:00:00Z'),
    duration: new Duration(2_400_000),
  },
];

export const MOCK_PODCAST_DETAIL: PodcastDetail = {
  podcast: MOCK_PODCASTS[0],
  episodes: MOCK_EPISODES,
};
