import { formatShortDate } from '@shared/utils/formatters';

describe('formatShortDate', () => {
  it('formats a date into MM/DD/YYYY', () => {
    const input = new Date(2025, 0, 15);

    expect(formatShortDate(input)).toBe('01/15/2025');
  });
});
