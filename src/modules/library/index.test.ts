import { describe, expect, it } from 'vitest';
import { generateISBN13, convertToLocalId } from '@/modules/library';

describe('generateISBN13', () => {
  it('ISBN-10 を ISBN-13 に変換する', () => {
    // ISBN-10: 4-06-938271-1 → ISBN-13: 9784069382710
    const result = generateISBN13('4069382711');
    expect(result).toBe('9784069382710');
  });

  it('ハイフン付き ISBN-10 を変換する', () => {
    const result = generateISBN13('4-06-938271-1');
    expect(result).toBe('9784069382710');
  });

  it('13桁の ISBN はそのまま返す', () => {
    const isbn13 = '9784069382710';
    expect(generateISBN13(isbn13)).toBe(isbn13);
  });

  it('ハイフン付き 13桁の ISBN はそのまま返す', () => {
    const isbn13 = '978-4-06-938271-0';
    expect(generateISBN13(isbn13)).toBe('978-4-06-938271-0');
  });
});

describe('convertToLocalId', () => {
  it('Negima プレフィックスを除去してローカル ID を返す', () => {
    expect(convertToLocalId('Negima_GK_2004103-12345')).toBe('12345');
  });

  it('Negima プレフィックスがない場合はそのまま返す', () => {
    expect(convertToLocalId('some-other-id')).toBe('some-other-id');
  });

  it('空文字列を処理する', () => {
    expect(convertToLocalId('')).toBe('');
  });
});
