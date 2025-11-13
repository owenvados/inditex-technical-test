/**
 * Formats a duration in milliseconds into a human-readable time string.
 * Returns format "mm:ss" for durations under one hour, or "hh:mm:ss" for longer durations.
 * Returns "--:--" if the duration is invalid, zero, or NaN.
 *
 * @param durationMs Duration in milliseconds to format.
 * @returns Formatted time string in "mm:ss" or "hh:mm:ss" format, or "--:--" for invalid input.
 */
export const formatDurationMs = (durationMs: number): string => {
  if (!durationMs || Number.isNaN(durationMs)) {
    return '--:--';
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
};
