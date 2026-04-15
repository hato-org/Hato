import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVersionedStorage } from '@/utils/versionedStorage';

describe('createVersionedStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getItem', () => {
    it('キーが存在しない場合は initialValue を返す', () => {
      const storage = createVersionedStorage<string>({ version: 1 });
      expect(storage.getItem('key', 'default')).toBe('default');
    });

    it('同バージョンのデータを正しく読み取る', () => {
      localStorage.setItem(
        'key',
        JSON.stringify({ version: 1, data: 'stored' }),
      );
      const storage = createVersionedStorage<string>({ version: 1 });
      expect(storage.getItem('key', 'default')).toBe('stored');
    });

    it('バージョンなし（旧形式）のデータで migrate がある場合はマイグレーションする', () => {
      localStorage.setItem('key', JSON.stringify('old-data'));
      const storage = createVersionedStorage<string>({
        version: 1,
        migrate: (old, ver) => {
          expect(ver).toBe(0);
          return `migrated-${old}`;
        },
      });

      const result = storage.getItem('key', 'default');
      expect(result).toBe('migrated-old-data');

      // ストレージがラップ形式に更新される
      const raw = JSON.parse(localStorage.getItem('key')!);
      expect(raw).toEqual({ version: 1, data: 'migrated-old-data' });
    });

    it('バージョンなし（旧形式）のデータで migrate がない場合は initialValue を返す', () => {
      localStorage.setItem('key', JSON.stringify('old-data'));
      const storage = createVersionedStorage<string>({ version: 1 });

      expect(storage.getItem('key', 'default')).toBe('default');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('古いバージョンのデータを migrate で更新する', () => {
      localStorage.setItem(
        'key',
        JSON.stringify({ version: 1, data: { name: 'test' } }),
      );
      const storage = createVersionedStorage<{ name: string; age: number }>({
        version: 2,
        migrate: (old, ver) => {
          expect(ver).toBe(1);
          const data = old as { name: string };
          return { ...data, age: 0 };
        },
      });

      const result = storage.getItem('key', { name: '', age: 0 });
      expect(result).toEqual({ name: 'test', age: 0 });
    });

    it('古いバージョンで migrate がない場合は initialValue を返す', () => {
      localStorage.setItem('key', JSON.stringify({ version: 1, data: 'old' }));
      const storage = createVersionedStorage<string>({ version: 2 });

      expect(storage.getItem('key', 'default')).toBe('default');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('不正な JSON の場合は initialValue を返す', () => {
      localStorage.setItem('key', 'not-valid-json{{{');
      const storage = createVersionedStorage<string>({ version: 1 });
      expect(storage.getItem('key', 'default')).toBe('default');
    });
  });

  describe('setItem', () => {
    it('バージョン付きラッパーでデータを保存する', () => {
      const storage = createVersionedStorage<string>({ version: 3 });
      storage.setItem('key', 'value');

      const raw = JSON.parse(localStorage.getItem('key')!);
      expect(raw).toEqual({ version: 3, data: 'value' });
    });

    it('オブジェクトデータを保存する', () => {
      const storage = createVersionedStorage<{ items: number[] }>({
        version: 1,
      });
      storage.setItem('key', { items: [1, 2, 3] });

      const raw = JSON.parse(localStorage.getItem('key')!);
      expect(raw).toEqual({ version: 1, data: { items: [1, 2, 3] } });
    });
  });

  describe('removeItem', () => {
    it('ストレージからキーを削除する', () => {
      localStorage.setItem('key', 'value');
      const storage = createVersionedStorage<string>({ version: 1 });

      storage.removeItem('key');
      expect(localStorage.getItem('key')).toBeNull();
    });
  });
});
