import { describe, expect, it } from 'vitest';
import { getDaysArray } from '@/utils/date';

describe('getDaysArray', () => {
  it('日曜から土曜の曜日配列を返す', () => {
    expect(getDaysArray()).toEqual(['日', '月', '火', '水', '木', '金', '土']);
  });

  it('7 要素の配列を返す', () => {
    expect(getDaysArray()).toHaveLength(7);
  });
});
