import type { Podcast } from '@podcasts/domain/entities/Podcast';

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
