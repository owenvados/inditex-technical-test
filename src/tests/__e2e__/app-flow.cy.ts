/// <reference types="cypress" />

const FEED_URL = 'https://feed.example.com/rss';
const FEED_PODCAST_ID = 'podcast-1';
const LOOKUP_PODCAST_ID = '101';

const topPodcastsResponse = {
  feed: {
    entry: [
      {
        id: {
          attributes: {
            'im:id': FEED_PODCAST_ID,
          },
        },
        'im:name': { label: 'Daily Tech' },
        'im:artist': { label: 'Tech Media' },
        'im:image': [
          { label: 'https://images.example.com/podcast-1-55.jpg' },
          { label: 'https://images.example.com/podcast-1-100.jpg' },
          { label: 'https://images.example.com/podcast-1-600.jpg' },
        ],
        summary: { label: 'Daily conversations about technology trends.' },
      },
    ],
  },
} as const;

const podcastLookupResponse = {
  resultCount: 2,
  results: [
    {
      collectionId: 101,
      collectionName: 'Daily Tech',
      artistName: 'Tech Media',
      artworkUrl600: 'https://images.example.com/podcast-1-600.jpg',
      description: 'Stay updated with our daily tech brief.',
      feedUrl: FEED_URL,
    },
    {
      trackId: 201,
      trackName: 'Launch Episode',
      episodeGuid: 'episode-guid-1',
      description: 'Preview of our new series.',
      episodeUrl: 'https://cdn.example.com/episode-1.mp3',
      releaseDate: '2024-05-01T10:00:00Z',
      trackTimeMillis: 123000,
    },
  ],
} as const;

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Daily Tech</title>
    <description><![CDATA[Daily Tech feed summary]]></description>
    <item>
      <guid>episode-guid-1</guid>
      <content:encoded><![CDATA[<p>Episode <strong>HTML</strong><script>alert('x')</script></p>]]></content:encoded>
      <description><![CDATA[<p>Fallback description</p>]]></description>
    </item>
  </channel>
</rss>`;

describe('Application Flow', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
      topPodcastsResponse,
    ).as('getTopPodcasts');

    cy.intercept('GET', 'https://itunes.apple.com/lookup*', podcastLookupResponse).as(
      'getPodcastDetail',
    );

    cy.intercept('GET', `https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`, {
      statusCode: 200,
      headers: {
        'content-type': 'application/xml',
      },
      body: feedXml,
    }).as('getPodcastFeed');
  });

  it('allows a user to browse podcasts and play an episode', () => {
    // Opens the catalogue and waits for the top podcasts list.
    cy.visit('/');
    cy.wait('@getTopPodcasts');

    // Shows the badge and the only podcast entry.
    cy.get('[data-testid="podcast-count"]').should('have.text', '1');
    cy.get('[data-testid="podcast-card"]').should('contain.text', 'Daily Tech');

    // Filters the list using a case-insensitive term.
    cy.get('input[placeholder="Filter podcasts..."]').as('searchInput').type('daily');
    cy.get('@searchInput').should('have.value', 'daily');
    cy.get('[data-testid="podcast-card"]').should('contain.text', 'Daily Tech');

    // Navigates to the podcast detail and waits for the lookup and feed requests.
    cy.get('[data-testid="podcast-card-link"]').click();
    cy.wait('@getPodcastDetail');
    cy.wait('@getPodcastFeed');

    // Displays the detail page and the episode table.
    cy.url().should('include', `/podcast/${FEED_PODCAST_ID}`);
    cy.get('[data-testid="podcast-detail-page"]').should('exist');
    cy.contains('Episodes: 1').should('be.visible');
    cy.get('[data-testid="episode-list"]').should('contain.text', 'Launch Episode');

    // Opens the episode detail from the table.
    cy.get('.episode-title-link').click();

    // Renders the episode detail view with description and audio player.
    cy.url().should('include', `/podcast/${LOOKUP_PODCAST_ID}/episode/201`);
    cy.get('[data-testid="episode-detail-page"]').should('exist');
    cy.get('.episode-detail__title').should('have.text', 'Launch Episode');
    cy.get('.episode-detail__description strong').should('have.text', 'HTML');
    cy.get('[data-testid="episode-audio"] source').should(
      'have.attr',
      'src',
      'https://cdn.example.com/episode-1.mp3',
    );
  });

  it('supports loading an episode directly from the URL', () => {
    cy.visit(`/podcast/${LOOKUP_PODCAST_ID}/episode/201`);
    cy.wait('@getPodcastDetail');
    cy.wait('@getPodcastFeed');

    cy.get('[data-testid="episode-detail-page"]').should('exist');
    cy.get('.episode-detail__title').should('have.text', 'Launch Episode');
    cy.get('[data-testid="episode-audio"] source').should(
      'have.attr',
      'src',
      'https://cdn.example.com/episode-1.mp3',
    );
  });

  it('returns to the home catalogue when clicking the header title', () => {
    cy.visit('/');
    cy.wait('@getTopPodcasts');
    cy.get('[data-testid="podcast-card-link"]').click();
    cy.wait('@getPodcastDetail');
    cy.wait('@getPodcastFeed');

    cy.get('.app-header__title').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('[data-testid="podcast-count"]').should('have.text', '1');
    cy.get('input[placeholder="Filter podcasts..."]').should('have.value', '');
    cy.get('[data-testid="podcast-card"]').should('contain.text', 'Daily Tech');
    cy.get('@getTopPodcasts.all').should('have.length', 1);
  });

  it('falls back to the default summary when the feed URL is missing', () => {
    cy.intercept('GET', 'https://itunes.apple.com/lookup*', {
      ...podcastLookupResponse,
      results: [
        {
          ...podcastLookupResponse.results[0],
          feedUrl: undefined,
          description: 'Description not available.',
        },
        podcastLookupResponse.results[1],
      ],
    }).as('getPodcastDetail');

    cy.intercept('GET', `https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`, {
      statusCode: 200,
      headers: {
        'content-type': 'application/xml',
      },
      body: feedXml,
    }).as('getPodcastFeed');

    cy.visit(`/podcast/${LOOKUP_PODCAST_ID}`);
    cy.wait('@getPodcastDetail');

    cy.get('@getPodcastFeed.all').then((calls) => {
      expect(calls).to.have.length(0);
    });

    cy.get('[data-testid="podcast-detail-page"]').should('exist');
    cy.get('.podcast-sidebar__description p').should('have.text', 'Description not available.');
  });

  it('shows an empty state when the filter has no matches', () => {
    cy.visit('/');
    cy.wait('@getTopPodcasts');

    cy.get('input[placeholder="Filter podcasts..."]').type('no-match-term');
    cy.get('[data-testid="podcast-count"]').should('have.text', '0');
    cy.get('[data-testid="podcast-list-empty"]').should('contain.text', 'No podcasts found');
  });

  it('renders cached podcasts immediately when a valid cache is present', () => {
    const now = Date.now();
    const cachedPodcasts = [
      {
        id: 'cached-1',
        title: 'Cached Daily',
        author: 'Cached Media',
        imageUrl: 'https://images.example.com/cached-1.jpg',
        summary: 'Cached summary entry.',
      },
    ];

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'podcasts:top-podcasts',
          JSON.stringify({
            data: cachedPodcasts,
            timestamp: now,
            expiresAt: now + 60 * 60 * 1000,
          }),
        );
      },
    });

    cy.get('[data-testid="podcast-card"]').should('contain.text', 'Cached Daily');
    cy.get('[data-testid="podcast-count"]').should('have.text', '1');
    cy.get('[data-testid="app-loading-spinner"]').should('not.exist');

    cy.get('@getTopPodcasts.all').then((calls) => {
      expect(calls).to.have.length(0);
    });
  });
});
