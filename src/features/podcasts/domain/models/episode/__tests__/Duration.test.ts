import { Duration } from '../Duration';

describe('Duration', () => {
  describe('constructor', () => {
    it('creates a Duration from milliseconds', () => {
      const duration = new Duration(125000);
      expect(duration.milliseconds).toBe(125000);
    });

    it('throws error for negative values', () => {
      expect(() => new Duration(-1000)).toThrow('Duration cannot be negative');
    });

    it('throws error for NaN values', () => {
      expect(() => new Duration(Number.NaN)).toThrow('Duration cannot be NaN');
    });

    it('throws error for Infinity values', () => {
      expect(() => new Duration(Number.POSITIVE_INFINITY)).toThrow(
        'Duration must be a finite number',
      );
      expect(() => new Duration(Number.NEGATIVE_INFINITY)).toThrow(
        'Duration must be a finite number',
      );
    });

    it('floors decimal values', () => {
      const duration = new Duration(125000.7);
      expect(duration.milliseconds).toBe(125000);
    });

    it('accepts zero duration', () => {
      const duration = new Duration(0);
      expect(duration.milliseconds).toBe(0);
    });
  });

  describe('equals', () => {
    it('returns true for durations with same value', () => {
      const duration1 = new Duration(125000);
      const duration2 = new Duration(125000);
      expect(duration1.equals(duration2)).toBe(true);
    });

    it('returns false for durations with different values', () => {
      const duration1 = new Duration(125000);
      const duration2 = new Duration(250000);
      expect(duration1.equals(duration2)).toBe(false);
    });

    it('returns false when comparing with non-Duration object', () => {
      const duration = new Duration(125000);
      expect(duration.equals(null as unknown as Duration)).toBe(false);
      expect(duration.equals({} as unknown as Duration)).toBe(false);
    });
  });

  describe('toSeconds', () => {
    it('converts milliseconds to seconds', () => {
      const duration = new Duration(125000);
      expect(duration.toSeconds()).toBe(125);
    });

    it('floors the result', () => {
      const duration = new Duration(125500);
      expect(duration.toSeconds()).toBe(125);
    });
  });

  describe('toMinutes', () => {
    it('converts milliseconds to minutes', () => {
      const duration = new Duration(125000);
      expect(duration.toMinutes()).toBe(2);
    });

    it('floors the result', () => {
      const duration = new Duration(125000);
      expect(duration.toMinutes()).toBe(2); // 2.083 minutes -> 2
    });
  });

  describe('toHours', () => {
    it('converts milliseconds to hours', () => {
      const duration = new Duration(3600000);
      expect(duration.toHours()).toBe(1);
    });

    it('floors the result', () => {
      const duration = new Duration(3900000);
      expect(duration.toHours()).toBe(1); // 1.083 hours -> 1
    });
  });

  describe('format', () => {
    it('formats duration as MM:SS', () => {
      const duration = new Duration(125000); // 2 minutes 5 seconds
      expect(duration.format()).toBe('2:05');
    });

    it('pads minutes and seconds with zeros', () => {
      const duration = new Duration(5000); // 5 seconds
      expect(duration.format()).toBe('00:05');
    });

    it('includes hours when duration exceeds 59 minutes', () => {
      const duration = new Duration(3900000); // 1 hour 5 minutes
      expect(duration.format()).toBe('1:05:00');
    });

    it('returns --:-- for zero duration', () => {
      const duration = new Duration(0);
      expect(duration.format()).toBe('--:--');
    });

    it('formats duration with hours correctly', () => {
      const duration = new Duration(3661000); // 1 hour 1 minute 1 second
      expect(duration.format()).toBe('1:01:01');
    });
  });

  describe('toString', () => {
    it('returns formatted duration string', () => {
      const duration = new Duration(125000);
      expect(duration.toString()).toBe('2:05');
    });
  });

  describe('static factory methods', () => {
    it('creates Duration from seconds', () => {
      const duration = Duration.fromSeconds(125);
      expect(duration.milliseconds).toBe(125000);
    });

    it('creates Duration from minutes', () => {
      const duration = Duration.fromMinutes(2);
      expect(duration.milliseconds).toBe(120000);
    });

    it('creates Duration from hours', () => {
      const duration = Duration.fromHours(1);
      expect(duration.milliseconds).toBe(3600000);
    });

    it('creates zero Duration', () => {
      const duration = Duration.zero();
      expect(duration.milliseconds).toBe(0);
    });
  });

  describe('isZero', () => {
    it('returns true for zero duration', () => {
      const duration = new Duration(0);
      expect(duration.isZero()).toBe(true);
    });

    it('returns false for non-zero duration', () => {
      const duration = new Duration(1000);
      expect(duration.isZero()).toBe(false);
    });
  });

  describe('add', () => {
    it('adds two durations', () => {
      const duration1 = new Duration(125000);
      const duration2 = new Duration(250000);
      const result = duration1.add(duration2);
      expect(result.milliseconds).toBe(375000);
    });

    it('returns a new Duration instance', () => {
      const duration1 = new Duration(125000);
      const duration2 = new Duration(250000);
      const result = duration1.add(duration2);
      expect(result).not.toBe(duration1);
      expect(result).not.toBe(duration2);
    });
  });

  describe('subtract', () => {
    it('subtracts two durations', () => {
      const duration1 = new Duration(250000);
      const duration2 = new Duration(125000);
      const result = duration1.subtract(duration2);
      expect(result.milliseconds).toBe(125000);
    });

    it('throws error when result would be negative', () => {
      const duration1 = new Duration(125000);
      const duration2 = new Duration(250000);
      expect(() => duration1.subtract(duration2)).toThrow(
        'Cannot subtract a larger duration from a smaller one',
      );
    });

    it('returns a new Duration instance', () => {
      const duration1 = new Duration(250000);
      const duration2 = new Duration(125000);
      const result = duration1.subtract(duration2);
      expect(result).not.toBe(duration1);
      expect(result).not.toBe(duration2);
    });
  });
});
