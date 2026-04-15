import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

interface VersionedStorageOptions<T> {
  version: number;
  migrate?: (oldValue: unknown, oldVersion: number) => T;
}

interface VersionedWrapper<T> {
  version: number;
  data: T;
}

/**
 * バージョン管理付きの localStorage アダプタ。
 *
 * ストレージには `{ version, data }` の形で保存され、
 * バージョン不一致時に migrate 関数でマイグレーションを行う。
 * migrate がない場合は initialValue にリセットされる。
 */
export function createVersionedStorage<T>(
  options: VersionedStorageOptions<T>,
): SyncStorage<T> {
  return {
    getItem(key: string, initialValue: T): T {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;

      try {
        const parsed = JSON.parse(raw) as VersionedWrapper<T> | T;

        // バージョンなし（旧形式）のデータ
        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          !('version' in parsed)
        ) {
          if (options.migrate) {
            const migrated = options.migrate(parsed, 0);
            const wrapped: VersionedWrapper<T> = {
              version: options.version,
              data: migrated,
            };
            localStorage.setItem(key, JSON.stringify(wrapped));
            return migrated;
          }
          localStorage.removeItem(key);
          return initialValue;
        }

        const { version, data } = parsed as VersionedWrapper<T>;

        if (version === options.version) return data;

        // バージョンが古い場合
        if (version < options.version && options.migrate) {
          const migrated = options.migrate(data, version);
          const wrapped: VersionedWrapper<T> = {
            version: options.version,
            data: migrated,
          };
          localStorage.setItem(key, JSON.stringify(wrapped));
          return migrated;
        }

        localStorage.removeItem(key);
        return initialValue;
      } catch {
        return initialValue;
      }
    },

    setItem(key: string, newValue: T): void {
      const wrapped: VersionedWrapper<T> = {
        version: options.version,
        data: newValue,
      };
      localStorage.setItem(key, JSON.stringify(wrapped));
    },

    removeItem(key: string): void {
      localStorage.removeItem(key);
    },
  };
}
