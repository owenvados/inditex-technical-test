import { formatDurationMs } from '@shared/utils/formatters';

describe('formatDurationMs', () => {
  it('formats milliseconds into mm:ss', () => {
    const oneMinuteThirty = 90000;

    expect(formatDurationMs(oneMinuteThirty)).toBe('01:30');
  });

  it('pads minutes and seconds with zeros', () => {
    const fiveSeconds = 5000;

    expect(formatDurationMs(fiveSeconds)).toBe('00:05');
  });

  it('includes hours when duration exceeds 59 minutes', () => {
    const oneHourFiveMinutes = 3900000;

    expect(formatDurationMs(oneHourFiveMinutes)).toBe('1:05:00');
  });

  it('returns --:-- for invalid durations', () => {
    expect(formatDurationMs(0)).toBe('--:--');
    expect(formatDurationMs(Number.NaN)).toBe('--:--');
  });
});
