import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatMessageTimestamp } from './timeUtils';

describe('formatMessageTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set system time to a specific date: 2024-01-15 12:00:00 UTC
    // Using UTC ensures a consistent baseline, but local time conversion will happen.
    // The tests compare the function output against the same local time conversion logic,
    // making them timezone-independent in terms of correctness.
    const date = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(date);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats timestamp from today correctly (time only)', () => {
    // 1 hour ago
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const timestamp = Math.floor(oneHourAgo.getTime() / 1000);

    // Since we lost milliseconds precision in timestamp conversion,
    // we should create the expected date from the timestamp to match exactly what the function does.
    const expectedDate = new Date(timestamp * 1000);

    const expected = expectedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    expect(formatMessageTimestamp(timestamp)).toBe(expected);
  });

  it('formats timestamp from yesterday correctly (date + time)', () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const timestamp = Math.floor(yesterday.getTime() / 1000);

    const expectedDate = new Date(timestamp * 1000);

    const timeStr = expectedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = expectedDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const expected = `${dateStr} ${timeStr}`;
    expect(formatMessageTimestamp(timestamp)).toBe(expected);
  });

  it('formats timestamp from different year correctly (date + time)', () => {
    const now = new Date();
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);
    const timestamp = Math.floor(lastYear.getTime() / 1000);

    const expectedDate = new Date(timestamp * 1000);

    const timeStr = expectedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = expectedDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const expected = `${dateStr} ${timeStr}`;
    expect(formatMessageTimestamp(timestamp)).toBe(expected);
  });

  it('uses current time when no timestamp is provided', () => {
    const now = new Date();
    const expected = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    expect(formatMessageTimestamp()).toBe(expected);
  });

  it('handles midnight correctly', () => {
    // Set system time to mid-day
    // We rely on the beforeEach setup for "now"
    const now = new Date();

    // Create a date that is at 00:00:01 on the same day (local time)
    // To do this reliably, we use setHours on a local date object
    const midnight = new Date(now);
    midnight.setHours(0, 0, 1, 0);
    const timestamp = Math.floor(midnight.getTime() / 1000);

    const expectedDate = new Date(timestamp * 1000);

    // Ensure that expectedDate is still "today" relative to "now"
    // This depends on the timezone. If 'now' (UTC 12:00) is used, and we set to 00:00:01 local,
    // we must ensure 'now' and 'midnight' are on the same local calendar day.

    // If we are in UTC:
    // now = 12:00
    // midnight = 00:00:01
    // same day.

    // If we are in PST (UTC-8):
    // now = 04:00
    // midnight = 00:00:01
    // same day.

    // If we are in UTC+13:
    // now = 01:00 (next day relative to UTC base?) No, Date object represents an instant.
    // '2024-01-15T12:00:00Z'
    // in UTC+13 (Tongatapu), this is 2024-01-16 01:00:00.
    // midnight local would be 2024-01-16 00:00:01.
    // same day.

    // So logic holds: if we construct 'midnight' from 'now' using setHours, it stays on the same day.

    const expected = expectedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Should be treated as today
    expect(formatMessageTimestamp(timestamp)).toBe(expected);
  });
});
