import type { HttpClient } from '@shared/infrastructure/http/HttpClient';
import { httpClient } from '@shared/infrastructure/http/HttpClient';
import { extractText, sanitizeHtml } from '@shared/utils/html/htmlSanitizer';

const CHANNEL_DESCRIPTION_TAGS = ['description', 'itunes:summary', 'summary'];
const ITEM_DESCRIPTION_TAGS = ['content\\:encoded', 'description', 'itunes\\:summary'];
const DEFAULT_TIMEOUT_MS = 20_000;

export type FeedItemDescriptionMap = Map<string, string>;

/**
 * Downloads RSS feeds and extracts sanitized channel/episode descriptions.
 */
export class FeedContentClient {
  private readonly documentCache = new Map<string, Document>();

  constructor(private readonly client: HttpClient = httpClient) {}

  /**
   * Retrieves the textual summary of an RSS channel.
   *
   * @param feedUrl Absolute RSS feed URL.
   * @returns Plain text description if available.
   */
  async fetchChannelSummary(feedUrl?: string): Promise<string | undefined> {
    if (!feedUrl) {
      return undefined;
    }

    try {
      const document = await this.loadDocument(feedUrl);
      const rawContent = this.findFirstContent(document, CHANNEL_DESCRIPTION_TAGS, false);
      return rawContent ? extractText(rawContent) : undefined;
    } catch (error) {
      console.warn('[FeedContentClient] Unable to resolve channel summary', error);
      return undefined;
    }
  }

  /**
   * Retrieves sanitized HTML descriptions for each RSS item keyed by its GUID.
   *
   * @param feedUrl Absolute RSS feed URL.
   * @returns Map containing sanitized HTML snippets per episode GUID.
   */
  async fetchItemDescriptions(feedUrl?: string): Promise<FeedItemDescriptionMap> {
    const descriptions: FeedItemDescriptionMap = new Map();

    if (!feedUrl) {
      return descriptions;
    }

    try {
      const document = await this.loadDocument(feedUrl);
      const items = Array.from(document.querySelectorAll('item'));

      items.forEach((item) => {
        const guid = item.querySelector('guid')?.textContent?.trim();
        if (!guid) {
          return;
        }

        const rawContent = this.findFirstContent(item, ITEM_DESCRIPTION_TAGS, true);
        if (!rawContent) {
          return;
        }

        descriptions.set(guid, sanitizeHtml(rawContent));
      });
    } catch (error) {
      console.warn('[FeedContentClient] Unable to resolve item descriptions', error);
    }

    return descriptions;
  }

  /**
   * Loads and caches the XML document for a given feed URL.
   *
   * @param feedUrl Absolute RSS feed URL.
   * @returns Parsed XML document.
   */
  private async loadDocument(feedUrl: string): Promise<Document> {
    const cached = this.documentCache.get(feedUrl);
    if (cached) {
      return cached;
    }

    const feedContents = await this.client.getText(feedUrl, true, {
      timeoutMs: DEFAULT_TIMEOUT_MS,
    });

    const parser = new DOMParser();
    const document = parser.parseFromString(feedContents, 'text/xml');
    this.documentCache.set(feedUrl, document);
    return document;
  }

  /**
   * Finds the first non-empty content for the provided CSS selectors.
   *
   * @param node Parent node used as search scope.
   * @param selectors List of selector candidates.
   * @param returnHtml Indicates if innerHTML should be returned instead of textContent.
   * @returns Matched content when available.
   */
  private findFirstContent(
    node: ParentNode,
    selectors: string[],
    returnHtml: boolean,
  ): string | undefined {
    for (const selector of selectors) {
      const element = node.querySelector(selector);
      const content = returnHtml ? element?.innerHTML : element?.textContent;
      if (content && content.trim().length > 0) {
        return content.trim();
      }
    }

    return undefined;
  }
}
