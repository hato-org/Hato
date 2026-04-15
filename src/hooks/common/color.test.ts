import { describe, expect, it } from 'vitest';
import { useStringHSLColor } from '@/hooks/common/color';

describe('useStringHSLColor', () => {
  it('既知の文字列から期待される色相角を計算する', () => {
    // "A" = charCode 65, 65 % 360 = 65
    expect(useStringHSLColor('A')).toBe('hsl(65 60% 60%)');
  });

  it('空文字列は hsl(0 60% 60%) を返す', () => {
    // reduce の初期値 0, 0 % 360 = 0
    expect(useStringHSLColor('')).toBe('hsl(0 60% 60%)');
  });

  it('同じ文字列は常に同じ結果を返す (決定的)', () => {
    const str = 'テスト文字列';
    const first = useStringHSLColor(str);
    const second = useStringHSLColor(str);
    expect(first).toBe(second);
  });

  it('異なる文字列は異なる色相を生成しうる', () => {
    const colorA = useStringHSLColor('abc');
    const colorB = useStringHSLColor('xyz');
    expect(colorA).not.toBe(colorB);
  });

  it('1 文字の文字列を処理できる', () => {
    // "a" = charCode 97, 97 % 360 = 97
    expect(useStringHSLColor('a')).toBe('hsl(97 60% 60%)');
  });

  it('返り値は hsl() 形式の文字列である', () => {
    expect(useStringHSLColor('test')).toMatch(/^hsl\(\d+ 60% 60%\)$/);
  });

  it('色相角は 0〜359 の範囲になる', () => {
    const result = useStringHSLColor('任意の長い文字列を入力');
    const angle = Number(result.match(/^hsl\((\d+)/)?.[1]);
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThan(360);
  });

  it('複数文字の charCode 合計から角度を計算する', () => {
    // "AB" = 65 + 66 = 131, 131 % 360 = 131
    expect(useStringHSLColor('AB')).toBe('hsl(131 60% 60%)');
  });

  it('日本語文字列も処理できる', () => {
    const result = useStringHSLColor('あ');
    // "あ" = charCode 12354, 12354 % 360 = 114
    expect(result).toBe('hsl(114 60% 60%)');
  });
});
