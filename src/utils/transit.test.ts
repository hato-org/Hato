import { describe, expect, it } from 'vitest';
import { formatTimeDifference, dayNumberToString } from '@/utils/transit';

describe('formatTimeDifference', () => {
  it('正の差分を mm:ss 形式でフォーマットする', () => {
    const left = new Date('2024-01-01T10:05:30');
    const right = new Date('2024-01-01T10:00:00');
    expect(formatTimeDifference(left, right)).toBe('5:30');
  });

  it('0秒差を正しくフォーマットする', () => {
    const date = new Date('2024-01-01T10:00:00');
    expect(formatTimeDifference(date, date)).toBe('0:00');
  });

  it('1分未満の差分を正しくフォーマットする', () => {
    const left = new Date('2024-01-01T10:00:45');
    const right = new Date('2024-01-01T10:00:00');
    expect(formatTimeDifference(left, right)).toBe('0:45');
  });

  it('秒がゼロパディングされる', () => {
    const left = new Date('2024-01-01T10:03:05');
    const right = new Date('2024-01-01T10:00:00');
    expect(formatTimeDifference(left, right)).toBe('3:05');
  });
});

describe('dayNumberToString', () => {
  it('0 を sunday に変換する', () => {
    expect(dayNumberToString(0)).toBe('sunday');
  });

  it('6 を saturday に変換する', () => {
    expect(dayNumberToString(6)).toBe('saturday');
  });

  it('1〜5 を weekdays に変換する', () => {
    for (let i = 1; i <= 5; i++) {
      expect(dayNumberToString(i)).toBe('weekdays');
    }
  });
});
