/**
 * Formats a Date instance into MM/DD/YYYY (US locale).
 */
export const formatShortDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
