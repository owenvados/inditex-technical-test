/**
 * Formats a Date-like value into MM/DD/YYYY (US locale).
 *
 * @param value Date instance or value convertible to Date.
 * @returns Formatted date string or dash placeholder when invalid.
 */
export const formatShortDate = (value: Date | string | number): string => {
  const date = value instanceof Date ? value : new Date(value);

  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
