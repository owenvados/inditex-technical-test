/**
 * Removes unsafe tags from an HTML fragment while keeping structural markup.
 *
 * @param value HTML fragment to sanitise.
 * @returns Sanitised HTML string or plain text fallback.
 */
const cleanupRssWrappers = (value: string): string =>
  value
    .replace(/<!\[CDATA\[\s*/gi, '')
    .replace(/&lt;!\[CDATA\[\s*/gi, '')
    .replace(/\s*\]\]>/gi, '')
    .replace(/\s*\]\]&gt;/gi, '')
    .trim();

const normaliseWhitespace = (value: string): string =>
  value
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\n/g, '\n')
    .trim();

const collectTextContent = (document: Document): string => {
  const bodyText = document.body?.textContent?.trim();
  if (bodyText && bodyText.length > 0) {
    return normaliseWhitespace(bodyText);
  }

  const headText = document.head?.textContent?.trim();
  if (headText && headText.length > 0) {
    return normaliseWhitespace(headText);
  }

  const documentText = document.documentElement?.textContent?.trim() ?? '';
  return normaliseWhitespace(documentText);
};

const stripTags = (value: string): string =>
  normaliseWhitespace(value.replace(/<\/?[^>]+(>|$)/g, ' '));

export const sanitizeHtml = (value: string): string => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(cleanupRssWrappers(value), 'text/html');

  parsedDocument.querySelectorAll('script, style, iframe').forEach((node) => node.remove());

  const sanitisedHtml = parsedDocument.body.innerHTML.trim();
  if (sanitisedHtml.length > 0) {
    return sanitisedHtml;
  }

  return extractText(value);
};

/**
 * Extracts the textual representation of an HTML fragment.
 *
 * @param value HTML fragment to convert into text.
 * @returns Plain text output.
 */
export const extractText = (value: string): string => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(cleanupRssWrappers(value), 'text/html');
  const textContent = collectTextContent(parsedDocument);

  if (textContent.length > 0) {
    return textContent;
  }

  return stripTags(value);
};
