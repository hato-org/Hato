import { describe, expect, it } from 'vitest';
import { generateDateFromGCDate } from '@/utils/classroom';

describe('generateDateFromGCDate', () => {
  it('日付と時刻の完全な値から Date を生成する', () => {
    const result = generateDateFromGCDate({
      date: { year: 2024, month: 6, day: 15 },
      timeOfDay: { hours: 3, minutes: 30, seconds: 45 },
    });

    expect(result.getFullYear()).toBe(2024);
    // month は 0-indexed なので入力の 6 → 5
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
    // hours に +9 (JST オフセット)
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(45);
  });

  it('timeOfDay が未指定の場合、hours は 9 になる', () => {
    const result = generateDateFromGCDate({
      date: { year: 2024, month: 1, day: 10 },
    });

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // 1月 → 0
    expect(result.getDate()).toBe(10);
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('date も timeOfDay も未指定の場合、デフォルト値を使用する', () => {
    const result = generateDateFromGCDate({});

    // year=0, month=(0-1)=-1, day=0, hours=0+9=9
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('date の一部のみ指定 (year のみ)', () => {
    const result = generateDateFromGCDate({
      date: { year: 2025 },
    });

    // month=(0-1)=-1, day=0 → JS Date はロールバック
    // month -1 = 前年12月、day 0 = その前月末日 → 2024年11月30日
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(10); // November
    expect(result.getHours()).toBe(9);
  });

  it('timeOfDay の一部のみ指定 (hours のみ)', () => {
    const result = generateDateFromGCDate({
      timeOfDay: { hours: 5 },
    });

    // hours: 5 + 9 = 14
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('month は 1-indexed の入力から 0-indexed に変換される', () => {
    // 12月 → month=12, 内部では 12-1=11
    const dec = generateDateFromGCDate({
      date: { year: 2024, month: 12, day: 25 },
    });
    expect(dec.getMonth()).toBe(11);

    // 1月 → month=1, 内部では 1-1=0
    const jan = generateDateFromGCDate({
      date: { year: 2024, month: 1, day: 1 },
    });
    expect(jan.getMonth()).toBe(0);
  });

  it('null フィールドはデフォルト値にフォールバックする', () => {
    const result = generateDateFromGCDate({
      date: { year: null, month: null, day: null },
      timeOfDay: { hours: null, minutes: null, seconds: null },
    });

    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('Date オブジェクトを返す', () => {
    const result = generateDateFromGCDate({});
    expect(result).toBeInstanceOf(Date);
  });
});
