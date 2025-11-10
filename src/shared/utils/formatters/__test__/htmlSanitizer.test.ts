import { extractText, sanitizeHtml } from '@shared/utils/formatters/htmlSanitizer';

describe('htmlSanitizer', () => {
  describe('sanitizeHtml', () => {
    it('keeps safe markup while removing unsafe nodes', () => {
      const input =
        '<p>Content <strong>here</strong><script>alert("x")</script><style>.a{}</style></p>';

      expect(sanitizeHtml(input)).toBe('<p>Content <strong>here</strong></p>');
    });

    it('falls back to plain text when markup is empty after sanitising', () => {
      expect(sanitizeHtml('<script>alert("x")</script>')).toBe('alert("x")');
    });

    it('removes cdata wrappers and closing artefacts', () => {
      const snippet = '<![CDATA[ <p>Line</p> ]]> ';

      expect(sanitizeHtml(snippet)).toBe('<p>Line</p>');
    });
  });

  describe('extractText', () => {
    it('returns textual representation of html fragments', () => {
      expect(extractText('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
    });

    it('returns trimmed original string when parsing fails', () => {
      expect(extractText('plain text')).toBe('plain text');
    });

    it('removes cdata remnants in plain text output', () => {
      expect(extractText('<![CDATA[ Plain text ]]>')).toBe('Plain text');
    });
  });
});
