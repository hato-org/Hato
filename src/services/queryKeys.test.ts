import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/services/queryKeys';

describe('queryKeys', () => {
  const topLevelKeys = [
    'user',
    'timetable',
    'calendar',
    'posts',
    'library',
    'transit',
    'status',
    'info',
    'settings',
    'scienceroom',
    'google',
    'classmatch',
  ] as const;

  it('すべてのトップレベルキーが存在する', () => {
    for (const key of topLevelKeys) {
      expect(queryKeys).toHaveProperty(key);
    }
  });

  it('トップレベルキーの数が正しい', () => {
    expect(Object.keys(queryKeys)).toHaveLength(topLevelKeys.length);
  });

  describe('.all キー', () => {
    it('user.all は配列で "user" を含む', () => {
      expect(queryKeys.user.all).toEqual(['user']);
    });

    it('timetable.all は配列で "timetable" を含む', () => {
      expect(queryKeys.timetable.all).toEqual(['timetable']);
    });

    it('calendar.all は配列で "calendar" を含む', () => {
      expect(queryKeys.calendar.all).toEqual(['calendar']);
    });

    it('transit.all は配列で "transit" を含む', () => {
      expect(queryKeys.transit.all).toEqual(['transit']);
    });

    it('status.all は配列で "status" を含む', () => {
      expect(queryKeys.status.all).toEqual(['status']);
    });

    it('google.all は配列で "google" を含む', () => {
      expect(queryKeys.google.all).toEqual(['google']);
    });

    it('classmatch.all は関数で年・季節を含む配列を返す', () => {
      expect(queryKeys.classmatch.all(2024, 'summer')).toEqual([
        'classmatch',
        2024,
        'summer',
      ]);
    });
  });

  describe('ファクトリ関数のキー構造', () => {
    it('user.detail は ID を含む配列を返す', () => {
      expect(queryKeys.user.detail('user-123')).toEqual(['user', 'user-123']);
    });

    it('user.profile はプロフィールキーを返す', () => {
      expect(queryKeys.user.profile()).toEqual(['user', 'profile']);
    });

    it('timetable.division は日付オブジェクトを含む', () => {
      const date = { year: 2024, month: 6, day: 15 };
      expect(queryKeys.timetable.division(date)).toEqual([
        'timetable',
        'division',
        date,
      ]);
    });

    it('timetable.note は日付オブジェクトを含む', () => {
      const date = { year: 2024, month: 1, day: 1 };
      expect(queryKeys.timetable.note(date)).toEqual([
        'timetable',
        'note',
        date,
      ]);
    });

    it('calendar.events は日付パラメータを含む', () => {
      const date = { year: 2024, month: 6 };
      expect(queryKeys.calendar.events(date)).toEqual([
        'calendar',
        'events',
        date,
      ]);
    });

    it('calendar.event は ID を含む', () => {
      expect(queryKeys.calendar.event('evt-1')).toEqual([
        'calendar',
        'event',
        'evt-1',
      ]);
    });

    it('posts.hatoboard はボードキーを返す', () => {
      expect(queryKeys.posts.hatoboard()).toEqual(['posts', 'hatoboard']);
    });

    it('posts.detail は ID を含む', () => {
      expect(queryKeys.posts.detail('post-1')).toEqual(['post', 'post-1']);
    });

    it('library.search はパラメータオブジェクトを含む', () => {
      const params = { q: 'test', page: 1 };
      expect(queryKeys.library.search(params)).toEqual([
        'library',
        'search',
        params,
      ]);
    });

    it('transit.timetable は行先と種別を含む', () => {
      expect(queryKeys.transit.timetable('tokyo', 'express')).toEqual([
        'transit',
        'timetable',
        'tokyo',
        'express',
      ]);
    });

    it('status.maintenance はメンテナンスキーを返す', () => {
      expect(queryKeys.status.maintenance()).toEqual(['status', 'maintenance']);
    });

    it('info.classList はタイプと学年を含む', () => {
      expect(queryKeys.info.classList('regular', '1')).toEqual([
        'info',
        'class',
        'regular',
        '1',
      ]);
    });

    it('settings.detail はユーザー ID を含む', () => {
      expect(queryKeys.settings.detail('u-1')).toEqual(['settings', 'u-1']);
    });

    it('scienceroom.table は日付オブジェクトを含む', () => {
      const date = { y: 2024, m: 6, d: 15 };
      expect(queryKeys.scienceroom.table(date)).toEqual(['scienceroom', date]);
    });

    it('google.courseWork はオブジェクトパラメータを含む', () => {
      expect(queryKeys.google.courseWork('c-1', 'w-1')).toEqual([
        'google',
        'courseWork',
        { courseId: 'c-1', id: 'w-1' },
      ]);
    });

    it('classmatch.sport は年・季節・競技を含む', () => {
      expect(queryKeys.classmatch.sport(2024, 'summer', 'volleyball')).toEqual([
        'classmatch',
        2024,
        'summer',
        'volleyball',
      ]);
    });

    it('classmatch.upcoming はフィルタオブジェクトを含む', () => {
      const filter = { type: 'regular', grade: '1', class: 'A' };
      expect(queryKeys.classmatch.upcoming(2024, 'winter', filter)).toEqual([
        'classmatch',
        2024,
        'winter',
        'upcoming',
        filter,
      ]);
    });
  });

  describe('readonly 制約', () => {
    it('all キーは readonly 配列である (as const による型レベル)', () => {
      // as const は TypeScript コンパイル時の readonly であり、
      // ランタイムでは通常の配列。型安全性は型チェックで保証される。
      expect(Array.isArray(queryKeys.user.all)).toBe(true);
      expect(queryKeys.user.all).toEqual(['user']);
    });

    it('ファクトリ関数の戻り値は as const で型レベル readonly', () => {
      const key = queryKeys.user.detail('id');
      expect(Array.isArray(key)).toBe(true);
      expect(key).toEqual(['user', 'id']);
    });
  });
});
