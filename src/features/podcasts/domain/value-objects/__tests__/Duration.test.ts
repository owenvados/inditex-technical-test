import { Duration } from '../Duration';

describe('Duration', () => {
  describe('constructor', () => {
    it('creates a Duration from valid milliseconds', () => {
      const duration = new Duration(90000);

      expect(duration.toMilliseconds()).toBe(90000);
    });

    it('defaults to 0 for invalid values', () => {
      const duration1 = new Duration(0);
      const duration2 = new Duration(Number.NaN);
      const duration3 = new Duration(-100);

      expect(duration1.toMilliseconds()).toBe(0);
      expect(duration2.toMilliseconds()).toBe(0);
      expect(duration3.toMilliseconds()).toBe(0);
    });
  });

  describe('format', () => {
    it('formats milliseconds into MM:ss format', () => {
      const oneMinuteThirty = new Duration(90000);

      expect(oneMinuteThirty.format()).toBe('01:30');
    });

    it('pads minutes and seconds with zeros to two digits', () => {
      const fiveSeconds = new Duration(5000);

      expect(fiveSeconds.format()).toBe('00:05');
    });

    it('includes hours when duration exceeds 59 minutes in HH:MM:ss format', () => {
      const oneHourFiveMinutes = new Duration(3900000);

      expect(oneHourFiveMinutes.format()).toBe('01:05:00');
    });

    it('returns --:-- for zero duration', () => {
      const zeroDuration = new Duration(0);

      expect(zeroDuration.format()).toBe('--:--');
    });

    it('returns --:-- for invalid duration', () => {
      const invalidDuration = new Duration(Number.NaN);

      expect(invalidDuration.format()).toBe('--:--');
    });
  });

  describe('equals', () => {
    it('returns true for equal durations', () => {
      const duration1 = new Duration(90000);
      const duration2 = new Duration(90000);

      expect(duration1.equals(duration2)).toBe(true);
    });

    it('returns false for different durations', () => {
      const duration1 = new Duration(90000);
      const duration2 = new Duration(120000);

      expect(duration1.equals(duration2)).toBe(false);
    });
  });
});
