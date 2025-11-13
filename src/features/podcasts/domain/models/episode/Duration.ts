/**
 * Value Object representing a duration in milliseconds.
 *
 * Immutable object that validates duration values and provides
 * formatting and conversion operations.
 *
 */
export class Duration {
  private readonly _milliseconds: number;

  /**
   * Creates a new Duration instance.
   *
   * @param milliseconds Duration in milliseconds. Must be >= 0 and finite.
   * @throws Error if milliseconds is negative, not finite, or NaN.
   */
  constructor(milliseconds: number) {
    if (Number.isNaN(milliseconds)) {
      throw new Error('Duration cannot be NaN');
    }

    if (!Number.isFinite(milliseconds)) {
      throw new Error('Duration must be a finite number');
    }

    if (milliseconds < 0) {
      throw new Error('Duration cannot be negative');
    }

    this._milliseconds = Math.floor(milliseconds);
  }

  /**
   * Returns the duration in milliseconds.
   */
  get milliseconds(): number {
    return this._milliseconds;
  }

  /**
   * Checks if this duration is equal to another duration.
   * Value Objects are compared by value, not by identity.
   *
   * @param other Another Duration instance to compare.
   * @returns true if both durations have the same value.
   */
  equals(other: Duration): boolean {
    if (!(other instanceof Duration)) {
      return false;
    }
    return this._milliseconds === other._milliseconds;
  }

  /**
   * Returns the duration in seconds.
   */
  toSeconds(): number {
    return Math.floor(this._milliseconds / 1000);
  }

  /**
   * Returns the duration in minutes.
   */
  toMinutes(): number {
    return Math.floor(this._milliseconds / 60000);
  }

  /**
   * Returns the duration in hours.
   */
  toHours(): number {
    return Math.floor(this._milliseconds / 3600000);
  }

  /**
   * Formats the duration as M:SS (or MM:SS when minutes are 0) or H:MM:SS.
   * Returns "--:--" for zero duration.
   *
   * Format rules:
   * - Less than 1 minute: "00:SS" (padded minutes and seconds)
   * - 1 minute or more, less than 1 hour: "M:SS" (minutes without padding, seconds with padding)
   * - 1 hour or more: "H:MM:SS" (hours without padding, minutes and seconds with padding)
   *
   * @returns Formatted duration string (e.g., "00:05", "2:05", "1:05:00", "--:--")
   */
  format(): string {
    if (this._milliseconds === 0) {
      return '--:--';
    }

    const totalSeconds = this.toSeconds();
    const hours = this.toHours();
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedSeconds = seconds.toString().padStart(2, '0');

    if (hours > 0) {
      // Format: H:MM:SS
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }

    if (minutes > 0) {
      // Format: M:SS (minutes without padding, seconds with padding)
      return `${minutes}:${formattedSeconds}`;
    }

    // Format: 00:SS (padded minutes and seconds when no minutes)
    return `00:${formattedSeconds}`;
  }

  /**
   * Returns the string representation of the duration.
   */
  toString(): string {
    return this.format();
  }

  /**
   * Creates a Duration from seconds.
   *
   * @param seconds Duration in seconds.
   * @returns New Duration instance.
   */
  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  /**
   * Creates a Duration from minutes.
   *
   * @param minutes Duration in minutes.
   * @returns New Duration instance.
   */
  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60000);
  }

  /**
   * Creates a Duration from hours.
   *
   * @param hours Duration in hours.
   * @returns New Duration instance.
   */
  static fromHours(hours: number): Duration {
    return new Duration(hours * 3600000);
  }

  /**
   * Returns a Duration representing zero duration.
   */
  static zero(): Duration {
    return new Duration(0);
  }

  /**
   * Checks if the duration is zero.
   */
  isZero(): boolean {
    return this._milliseconds === 0;
  }

  /**
   * Adds another duration to this duration.
   *
   * @param other Another Duration to add.
   * @returns New Duration instance with the sum.
   */
  add(other: Duration): Duration {
    return new Duration(this._milliseconds + other._milliseconds);
  }

  /**
   * Subtracts another duration from this duration.
   *
   * @param other Another Duration to subtract.
   * @returns New Duration instance with the difference.
   * @throws Error if the result would be negative.
   */
  subtract(other: Duration): Duration {
    const result = this._milliseconds - other._milliseconds;
    if (result < 0) {
      throw new Error('Cannot subtract a larger duration from a smaller one');
    }
    return new Duration(result);
  }
}
