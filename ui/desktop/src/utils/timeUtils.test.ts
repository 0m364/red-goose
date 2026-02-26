import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatMessageTimestamp } from './timeUtils';

describe('formatMessageTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats time correctly for messages from today', () => {
    const now = new Date('2024-03-15T14:30:00'); // 2:30 PM
    vi.setSystemTime(now);

    const timestamp = Math.floor(now.getTime() / 1000);
    const result = formatMessageTimestamp(timestamp);

    // Expected format: HH:MM AM/PM
    const expected = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    expect(result).toBe(expected);
  });

  it('formats date and time for messages from yesterday', () => {
    const now = new Date('2024-03-15T14:30:00');
    vi.setSystemTime(now);

    const yesterday = new Date('2024-03-14T10:15:00'); // Yesterday 10:15 AM
    const timestamp = Math.floor(yesterday.getTime() / 1000);

    const result = formatMessageTimestamp(timestamp);

    const timeStr = yesterday.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = yesterday.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    expect(result).toBe(`${dateStr} ${timeStr}`);
  });

  it('formats date and time for messages from a different year', () => {
    const now = new Date('2024-03-15T14:30:00');
    vi.setSystemTime(now);

    const lastYear = new Date('2023-03-15T14:30:00');
    const timestamp = Math.floor(lastYear.getTime() / 1000);

    const result = formatMessageTimestamp(timestamp);

    const timeStr = lastYear.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = lastYear.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    expect(result).toBe(`${dateStr} ${timeStr}`);
  });

  it('uses current time if no timestamp is provided', () => {
    const now = new Date('2024-03-15T14:30:00');
    vi.setSystemTime(now);

    const result = formatMessageTimestamp();

    const expected = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    expect(result).toBe(expected);
  });

  it('handles midnight boundary correctly', () => {
    // Set time to just after midnight
    const now = new Date('2024-03-15T00:00:01');
    vi.setSystemTime(now);

    const timestamp = Math.floor(now.getTime() / 1000);
    const result = formatMessageTimestamp(timestamp);

    const expected = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    expect(result).toBe(expected);
  });
});
