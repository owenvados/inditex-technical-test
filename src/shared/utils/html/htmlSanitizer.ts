/**
 * Removes unsafe tags from an HTML fragment while keeping structural markup.
 *
 * @param value HTML fragment to sanitise.
 * @returns Sanitised HTML string or plain text fallback.
 */
export const sanitizeHtml = (value: string): string => {
  const parser = new DOMParser();
  const document = parser.parseFromString(value, 'text/html');

  document.body.querySelectorAll('script, style, iframe').forEach((node) => node.remove());

  const sanitisedHtml = document.body.innerHTML.trim();
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
  const document = parser.parseFromString(value, 'text/html');
  const text = document.body.textContent?.trim() ?? '';
  return text.length > 0 ? text : value.trim();
};
