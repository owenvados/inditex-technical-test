import type { HttpClient } from '@shared/infrastructure/http/HttpClient';
import { httpClient } from '@shared/infrastructure/http/HttpClient';
import { extractText, sanitizeHtml } from '@shared/utils/formatters/htmlSanitizer';

export type FeedItemDescriptionMap = Map<string, string>;

export class FeedContentClient {
  private readonly documentCache = new Map<string, Document>();

  constructor(private readonly client: HttpClient = httpClient) {}

  async fetchChannelSummary(feedUrl?: string): Promise<string | undefined> {
    if (!feedUrl) {
      return undefined;
    }

    try {
      const document = await this.loadDocument(feedUrl);
      const channel = document.querySelector('channel');
      if (!channel) {
        return undefined;
      }

      const content =
        channel.querySelector('description')?.textContent ||
        channel.querySelector('itunes\\:summary')?.textContent ||
        channel.querySelector('summary')?.textContent;

      return content ? extractText(content) : undefined;
    } catch (error) {
      console.warn('[FeedContentClient] Unable to resolve channel summary', error);
      return undefined;
    }
  }

  async fetchItemDescriptions(feedUrl?: string): Promise<FeedItemDescriptionMap> {
    const descriptions: FeedItemDescriptionMap = new Map();

    if (!feedUrl) {
      return descriptions;
    }

    try {
      const document = await this.loadDocument(feedUrl);
      const items = Array.from(document.getElementsByTagName('item'));

      items.forEach((item) => {
        const guid = item.querySelector('guid')?.textContent?.trim();
        if (!guid) {
          return;
        }

        // Try different selectors for episode description
        let content: string | undefined;

        // Search for content:encoded - try namespace first, then fallback to tagName search
        const contentEncoded =
          item.getElementsByTagNameNS('http://purl.org/rss/1.0/modules/content/', 'encoded')[0] ||
          Array.from(item.getElementsByTagName('*')).find(
            (el) => el.tagName.toLowerCase() === 'content:encoded',
          );
        if (contentEncoded) {
          content = contentEncoded.innerHTML || contentEncoded.textContent || undefined;
        }

        // Fallback to description
        if (!content) {
          const desc = item.querySelector('description');
          if (desc) {
            content = desc.innerHTML || desc.textContent || undefined;
          }
        }

        // Fallback to itunes:summary
        if (!content) {
          const allElements = Array.from(item.getElementsByTagName('*'));
          const itunesSummary = allElements.find(
            (el) => el.tagName.toLowerCase() === 'itunes:summary' || el.localName === 'summary',
          );
          if (itunesSummary) {
            content = itunesSummary.innerHTML || itunesSummary.textContent || undefined;
          }
        }

        if (content) {
          descriptions.set(guid, sanitizeHtml(content));
        }
      });
    } catch (error) {
      console.warn('[FeedContentClient] Unable to resolve item descriptions', error);
    }

    return descriptions;
  }

  private async loadDocument(feedUrl: string): Promise<Document> {
    const cached = this.documentCache.get(feedUrl);
    if (cached) {
      return cached;
    }

    let feedContents: string;

    try {
      feedContents = await this.client.getText(feedUrl, true);
    } catch (error) {
      console.warn('[FeedContentClient] Proxy feed request failed, retrying without proxy', error);
      feedContents = await this.client.getText(feedUrl, false);
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(feedContents, 'text/xml');
    this.documentCache.set(feedUrl, document);
    return document;
  }
}
