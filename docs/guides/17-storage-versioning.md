# 17: ストレージバージョニングの導入

## 現状の問題

- Jotai の `atomWithStorage` で永続化されているアトムにバージョン管理がない
- スキーマ変更（プロパティ追加・削除・型変更）時に既存ユーザーのデータが不整合を起こす可能性がある
- 例: `hato.user` のスキーマが変わった場合、古いデータで `undefined` アクセスが発生し得る

## 現在の永続化アトム一覧

| ストレージキー | アトム | ファイル |
|--------------|--------|---------|
| `hato.auth` | `jwtAtom` | `src/store/auth.ts` |
| `hato.user` | `userAtom` | `src/store/auth.ts` |
| `hato.overlay` | `overlayAtom` | `src/store/overlay.ts` |
| `hato.tutorial` | `tutorialAtom` | `src/store/tutorial.ts` |
| `hato.library.bookmarks` | `libraryBookmarkAtom` | `src/store/library.ts` |
| `hato.google.pinned` | `GCBookmarkAtom` | `src/store/classroom.ts` |
| `hato.posts.pinned` | `pinnedPostAtom` | `src/store/posts.ts` |
| `hato.card.order` | `cardOrderAtom` | `src/store/dashboard.ts` |

## 目標

- ストレージキーにバージョンを含め、スキーマ変更時にマイグレーションを実行可能にする
- カスタム `storage` を作成し、バージョン不一致時に自動マイグレーションを行う

## 実装手順

### Step 1: バージョン付きストレージユーティリティを作成する

`src/utils/versionedStorage.ts` を新規作成する。

```typescript
import type { SyncStringStorage } from 'jotai/vanilla/utils/atomWithStorage';

interface VersionedStorageOptions<T> {
  version: number;
  migrate?: (oldValue: unknown, oldVersion: number) => T;
}

/**
 * バージョン管理付きの localStorage アダプタを作成する。
 * ストレージには { version: number, data: T } の形で保存される。
 */
export function createVersionedStorage<T>(
  options: VersionedStorageOptions<T>
): SyncStringStorage {
  return {
    getItem(key: string, initialValue: string): string {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;

      try {
        const parsed = JSON.parse(raw);

        // バージョンなし（旧形式）の場合
        if (parsed.version === undefined) {
          if (options.migrate) {
            const migrated = options.migrate(parsed, 0);
            const wrapped = { version: options.version, data: migrated };
            localStorage.setItem(key, JSON.stringify(wrapped));
            return JSON.stringify(migrated);
          }
          // マイグレーション関数がなければ初期値にリセット
          localStorage.removeItem(key);
          return initialValue;
        }

        // バージョンが一致する場合
        if (parsed.version === options.version) {
          return JSON.stringify(parsed.data);
        }

        // バージョンが古い場合
        if (parsed.version < options.version && options.migrate) {
          const migrated = options.migrate(parsed.data, parsed.version);
          const wrapped = { version: options.version, data: migrated };
          localStorage.setItem(key, JSON.stringify(wrapped));
          return JSON.stringify(migrated);
        }

        // マイグレーションできない場合はリセット
        localStorage.removeItem(key);
        return initialValue;
      } catch {
        return initialValue;
      }
    },
    setItem(key: string, value: string): void {
      const wrapped = { version: options.version, data: JSON.parse(value) };
      localStorage.setItem(key, JSON.stringify(wrapped));
    },
    removeItem(key: string): void {
      localStorage.removeItem(key);
    },
  };
}
```

### Step 2: アトムにバージョン管理を適用する

バージョン管理が必要なアトム（スキーマが複雑なもの）に適用する。

```typescript
// src/store/auth.ts
import { createVersionedStorage } from '@/utils/versionedStorage';

const userStorage = createVersionedStorage<User | null>({
  version: 1,
  migrate: (oldValue, oldVersion) => {
    if (oldVersion === 0) {
      // v0 → v1: 旧形式からの移行
      return oldValue as User | null;
    }
    return null;
  },
});

export const userAtom = atomWithStorage<User | null>(
  'hato.user',
  null,
  userStorage,
  { getOnInit: true },
);
```

### Step 3: 将来のスキーマ変更時の手順

1. `version` をインクリメントする
2. `migrate` 関数に新しいバージョンのケースを追加する

```typescript
const userStorage = createVersionedStorage<User | null>({
  version: 2, // v1 → v2
  migrate: (oldValue, oldVersion) => {
    if (oldVersion === 1) {
      // v1 → v2: newField を追加
      const old = oldValue as UserV1;
      return { ...old, newField: 'default' };
    }
    return null;
  },
});
```

### Step 4: 段階的な適用

全アトムに一度に適用する必要はない。以下の優先順位で適用する:

1. **高優先**: `userAtom` — スキーマが複雑で変更されやすい
2. **中優先**: `overlayAtom` — #07 の分割後に適用
3. **低優先**: `jwtAtom`, `cardOrderAtom` — 単純な型（string, string[]）で変更リスクが低い

## 確認事項

- [ ] 既存ユーザーのデータが正しくマイグレーションされるか確認
- [ ] 新規ユーザーのデータが正しいバージョンで保存されるか確認
- [ ] バージョン不一致時にマイグレーション関数が呼ばれるか確認
- [ ] マイグレーション関数がない場合にデフォルト値にリセットされるか確認
- [ ] `yarn build` が成功するか確認

## 関連ファイル

- `src/store/auth.ts` — 最初の適用対象
- `src/store/` 配下の全ファイル — 段階的に適用
