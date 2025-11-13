/**
 * Value object representing a duration in milliseconds.
 * Encapsulates duration logic including formatting and validation.
 * Immutable and compared by value.
 */
export class Duration {
  private readonly value: number;

  /**
   * Creates a Duration value object from milliseconds.
   * Validates that the value is a valid number and not negative.
   *
   * @param milliseconds Duration in milliseconds. Defaults to 0 if invalid.
   * @returns Duration value object.
   */
  constructor(milliseconds: number) {
    if (!milliseconds || Number.isNaN(milliseconds) || milliseconds < 0) {
      this.value = 0;
    } else {
      this.value = milliseconds;
    }
  }

  /**
   * Gets the duration value in milliseconds.
   *
   * @returns Duration in milliseconds.
   */
  toMilliseconds(): number {
    return this.value;
  }

  /**
   * Formats the duration into a human-readable time string.
   * Returns format "MM:ss" (two-digit minutes and seconds) for durations under one hour,
   * or "HH:MM:ss" (two-digit hours, minutes, and seconds) for longer durations.
   * Returns "--:--" if the duration is invalid or zero.
   *
   * @returns Formatted time string in "MM:ss" or "HH:MM:ss" format, or "--:--" for invalid input.
   */
  format(): string {
    if (this.value === 0) {
      return '--:--';
    }

    const totalSeconds = Math.floor(this.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Checks if two Duration objects are equal by comparing their values.
   *
   * @param other Another Duration object to compare.
   * @returns True if both durations have the same value, false otherwise.
   */
  equals(other: Duration): boolean {
    return this.value === other.value;
  }
}
