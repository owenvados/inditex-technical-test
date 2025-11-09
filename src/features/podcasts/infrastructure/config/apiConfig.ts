/**
 * Infrastructure-specific constants related to API endpoints.
 */
export const ITUNES_ENDPOINTS = {
  BASE_URL: 'https://itunes.apple.com',
  TOP_PODCASTS_FEED_PATH: '/us/rss/toppodcasts',
  TOP_PODCAST_LIMIT: 100,
  MUSIC_GENRE_ID: '1310',
};

/**
 * Builds the public RSS URL to retrieve top podcasts.
 *
 * @param limit Maximum number of podcasts to retrieve.
 * @param genreId iTunes genre identifier.
 * @returns Fully qualified RSS endpoint URL.
 */
export const buildTopPodcastsFeedUrl = (
  limit = ITUNES_ENDPOINTS.TOP_PODCAST_LIMIT,
  genreId = ITUNES_ENDPOINTS.MUSIC_GENRE_ID,
): string =>
  `${ITUNES_ENDPOINTS.BASE_URL}${ITUNES_ENDPOINTS.TOP_PODCASTS_FEED_PATH}/limit=${limit}/genre=${genreId}/json`;
