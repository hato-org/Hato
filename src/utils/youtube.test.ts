import { describe, expect, it } from 'vitest';
import { getYouTubeID } from '@/utils/youtube';

describe('getYouTubeID', () => {
  it('標準の watch URL から ID を取得する', () => {
    expect(getYouTubeID('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('youtu.be 短縮 URL から ID を取得する', () => {
    expect(getYouTubeID('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('shorts URL から ID を取得する', () => {
    expect(getYouTubeID('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('embed URL から ID を取得する', () => {
    expect(getYouTubeID('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('live URL から ID を取得する', () => {
    expect(getYouTubeID('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('/v/ URL から ID を取得する', () => {
    expect(getYouTubeID('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('追加のクエリパラメータがあっても ID を取得する', () => {
    expect(
      getYouTubeID('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('ハッシュフラグメントがあっても ID を取得する', () => {
    expect(
      getYouTubeID('https://www.youtube.com/watch?v=dQw4w9WgXcQ#t=123'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('undefined を渡すと undefined を返す', () => {
    expect(getYouTubeID(undefined)).toBeUndefined();
  });

  it('空文字を渡すと undefined を返す', () => {
    expect(getYouTubeID('')).toBeUndefined();
  });

  it('YouTube 以外の URL は undefined を返す', () => {
    expect(getYouTubeID('https://example.com/video')).toBeUndefined();
  });

  it('&vi= パラメータから ID を取得する', () => {
    expect(
      getYouTubeID(
        'https://www.youtube.com/watch?feature=related&vi=dQw4w9WgXcQ',
      ),
    ).toBe('dQw4w9WgXcQ');
  });

  it('?vi= パラメータから ID を取得する', () => {
    expect(getYouTubeID('https://www.youtube.com/?vi=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('youtu.be 短縮 URL にクエリパラメータがあっても ID を取得する', () => {
    expect(getYouTubeID('https://youtu.be/dQw4w9WgXcQ?t=30')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('引数なしで呼ぶと undefined を返す', () => {
    expect(getYouTubeID()).toBeUndefined();
  });
});
