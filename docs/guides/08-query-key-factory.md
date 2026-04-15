# 08: Query Key Factory の導入

## 現状の問題

- クエリキーが各サービスファイルにハードコード文字列として散在している
  - 例: `['user', id]`, `['calendar', 'events', year, month]`, `['google', 'courses']`
- キャッシュ無効化時にタイポによるミスが発生しやすい
- キー構造の変更時に全箇所を手動で修正する必要がある

## 目標

- 全クエリキーを1箇所で管理するファクトリパターンを導入する
- 型安全なキー生成を実現する

## 実装手順

### Step 1: クエリキーの現状を調査する

```bash
grep -rn "queryKey:" src/services/ --include="*.ts" --include="*.tsx"
grep -rn "invalidateQueries\|setQueryData\|getQueryData\|setQueryDefaults" src/ --include="*.ts" --include="*.tsx"
```

全てのクエリキーパターンを抽出する。

### Step 2: Query Key Factory を作成する

`src/services/queryKeys.ts` を新規作成する。

```typescript
export const queryKeys = {
  user: {
    all: ['user'] as const,
    byId: (id: string) => [...queryKeys.user.all, id] as const,
  },
  calendar: {
    all: ['calendar'] as const,
    events: (params: { year: number; month: number }) =>
      [...queryKeys.calendar.all, 'events', params] as const,
    detail: (id: string) =>
      [...queryKeys.calendar.all, 'detail', id] as const,
  },
  timetable: {
    all: ['timetable'] as const,
    schedule: () => [...queryKeys.timetable.all, 'schedule'] as const,
    subjects: () => [...queryKeys.timetable.all, 'subjects'] as const,
  },
  posts: {
    all: ['posts'] as const,
    list: (params?: { page?: number }) =>
      [...queryKeys.posts.all, 'list', params] as const,
    detail: (id: string) =>
      [...queryKeys.posts.all, 'detail', id] as const,
    hatoboard: () => [...queryKeys.posts.all, 'hatoboard'] as const,
  },
  library: {
    all: ['library'] as const,
    search: (params: { keyword: string }) =>
      [...queryKeys.library.all, 'search', params] as const,
    book: (isbn: string) =>
      [...queryKeys.library.all, 'book', isbn] as const,
  },
  classroom: {
    all: ['google'] as const,
    courses: () => [...queryKeys.classroom.all, 'courses'] as const,
    course: (id: string) =>
      [...queryKeys.classroom.all, 'course', id] as const,
    announcements: (courseId: string) =>
      [...queryKeys.classroom.all, 'announcements', courseId] as const,
    coursework: (courseId: string) =>
      [...queryKeys.classroom.all, 'coursework', courseId] as const,
  },
  classmatch: {
    all: ['classmatch'] as const,
    byYear: (year: number) =>
      [...queryKeys.classmatch.all, year] as const,
  },
  status: {
    all: ['status'] as const,
  },
  transit: {
    all: ['transit'] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  info: {
    all: ['info'] as const,
  },
  push: {
    all: ['push'] as const,
    subscription: () => [...queryKeys.push.all, 'subscription'] as const,
  },
} as const;
```

### Step 3: 各サービスファイルを順次更新する

各 `src/services/<feature>/index.ts` で以下のように置き換える。

**変更前:**
```typescript
return useQuery({
  queryKey: ['calendar', 'events', year, month],
  queryFn: async ({ signal }) => { ... },
});
```

**変更後:**
```typescript
import { queryKeys } from '@/services/queryKeys';

return useQuery({
  queryKey: queryKeys.calendar.events({ year, month }),
  queryFn: async ({ signal }) => { ... },
});
```

**キャッシュ無効化の変更例:**
```typescript
// 変更前
queryClient.invalidateQueries({ queryKey: ['calendar'] });

// 変更後
queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
```

### Step 4: auth モジュールの queryDefaults も更新する

`src/modules/auth/index.ts`:

```typescript
// 変更前
queryClient.setQueryDefaults(['user', userData._id], { ... });
queryClient.setQueryData(['user', userData._id], userData);

// 変更後
queryClient.setQueryDefaults(queryKeys.user.byId(userData._id), { ... });
queryClient.setQueryData(queryKeys.user.byId(userData._id), userData);
```

### Step 5: テストの追加

```typescript
import { describe, it, expect } from 'vitest';
import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  it('should generate correct user keys', () => {
    expect(queryKeys.user.all).toEqual(['user']);
    expect(queryKeys.user.byId('123')).toEqual(['user', '123']);
  });

  it('should generate correct calendar keys', () => {
    expect(queryKeys.calendar.events({ year: 2024, month: 1 }))
      .toEqual(['calendar', 'events', { year: 2024, month: 1 }]);
  });

  it('should allow prefix matching for invalidation', () => {
    const eventKey = queryKeys.calendar.events({ year: 2024, month: 1 });
    expect(eventKey.slice(0, queryKeys.calendar.all.length))
      .toEqual(queryKeys.calendar.all);
  });
});
```

## 確認事項

- [ ] 全てのサービスファイルでクエリキーが置換されているか確認
- [ ] キャッシュ無効化が正しく動作するか確認（特にプレフィックスマッチング）
- [ ] `yarn build` が成功するか確認
- [ ] 各ページのデータ取得が正常に動作するか確認

## 関連ファイル

- `src/services/` 配下の全ファイル — クエリキーの置換対象
- `src/modules/auth/index.ts` — queryDefaults の更新
