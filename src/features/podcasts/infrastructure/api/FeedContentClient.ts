import type { HttpClient } from '@shared/infrastructure/http/HttpClient';
import { httpClient } from '@shared/infrastructure/http/HttpClient';
import { extractText, sanitizeHtml } from '@shared/utils/formatters/htmlSanitizer';

const CHANNEL_DESCRIPTION_TAGS = ['description', 'itunes:summary', 'summary'];
const ITEM_DESCRIPTION_TAGS = ['content\\:encoded', 'description', 'itunes\\:summary'];
const DEFAULT_TIMEOUT_MS = 20000;
const NAMESPACE_FALLBACKS: Record<string, string> = {
  content: 'http://purl.org/rss/1.0/modules/content/',
  itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
};

const ensureNamespaceDeclarations = (xml: string): string => {
  return Object.entries(NAMESPACE_FALLBACKS).reduce((markup, [prefix, uri]) => {
    if (!new RegExp(`<${prefix}:`, 'i').test(markup)) {
      return markup;
    }

    if (new RegExp(`xmlns:${prefix}=`, 'i').test(markup)) {
      return markup;
    }

    return markup.replace(/<rss([^>]*)>/i, `<rss$1 xmlns:${prefix}="${uri}">`);
  }, xml);
};

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
      const items = Array.from(document.getElementsByTagName('item'));

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

    let feedContents: string;

    try {
      feedContents = await this.client.getText(feedUrl, true, {
        timeoutMs: DEFAULT_TIMEOUT_MS,
      });
    } catch (error) {
      console.warn('[FeedContentClient] Proxy feed request failed, retrying without proxy', error);
      feedContents = await this.client.getText(feedUrl, false, {
        timeoutMs: DEFAULT_TIMEOUT_MS,
      });
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(ensureNamespaceDeclarations(feedContents), 'text/xml');
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
      const element = this.findElement(node, selector);
      const content = this.resolveContent(element, returnHtml);
      if (content && content.trim().length > 0) {
        return content.trim();
      }
    }

    return undefined;
  }

  private resolveContent(element: Element | null, returnHtml: boolean): string | undefined {
    if (!element) {
      return undefined;
    }

    if (returnHtml) {
      return element.innerHTML ?? undefined;
    }

    return element.textContent ?? undefined;
  }

  private findElement(node: ParentNode, selector: string): Element | null {
    const queriedElement = this.querySelectorSafe(node, selector);
    if (queriedElement) {
      return queriedElement;
    }

    const normalisedSelector = selector.replace(/\\:/g, ':');
    return this.findElementByLocalName(node, normalisedSelector);
  }

  private querySelectorSafe(node: ParentNode, selector: string): Element | null {
    if (node instanceof Document || node instanceof Element) {
      try {
        return node.querySelector(selector);
      } catch {
        return null;
      }
    }

    return null;
  }

  private findElementByLocalName(node: ParentNode, selector: string): Element | null {
    if (!selector) {
      return null;
    }

    const [namespace, localNameCandidate] = selector.split(':');
    const expectedLocalName = (localNameCandidate ?? selector).toLowerCase();
    const expectedWithPrefix = namespace?.length
      ? `${namespace.toLowerCase()}:${expectedLocalName}`
      : undefined;

    const queue: Element[] = [];

    if (node instanceof Document) {
      if (node.documentElement) {
        queue.push(node.documentElement);
      }
    } else if (node instanceof Element) {
      queue.push(node);
    }

    while (queue.length > 0) {
      const element = queue.shift() as Element;
      const elementTag = (element.tagName ?? element.nodeName).toLowerCase();
      const elementLocal = (element.localName ?? elementTag).toLowerCase();
      const elementWithPrefix = element.prefix
        ? `${element.prefix.toLowerCase()}:${elementLocal}`
        : undefined;

      if (
        elementTag === selector.toLowerCase() ||
        elementLocal === expectedLocalName ||
        elementWithPrefix === expectedWithPrefix
      ) {
        return element;
      }

      queue.push(...Array.from(element.children));
    }

    return null;
  }
}
