# 18: ルート構造のリファクタリング

## 現状の問題

- `src/routes.tsx` に23個のルートがフラットに定義されている
- 機能グループ（classroom, library, settings）が同階層に並んでおり、見通しが悪い
- `timetable/editor/search?` (L105) でパスにクエリパラメータが含まれている（非標準パターン）
- ルートごとに `errorElement: <ErrorFallback />` を繰り返し指定している

## 目標

- 機能別にルートをネスト構造にする
- `errorElement` の重複を削減する
- クエリパラメータをパス定義から分離する

## 実装手順

### Step 1: ルートを機能グループに整理する

**変更前（フラット）:**
```typescript
{
  path: '/',
  element: <RequireLogin />,
  children: [
    { path: 'classroom', element: <Classroom /> },
    { path: 'classroom/bookmarks', element: <ClassroomBookmarks /> },
    { path: 'classroom/course/:id', element: <ClassroomCourse /> },
    { path: 'classroom/course/:id/announcement/:announcementId', element: <ClassroomAnnouncement /> },
    { path: 'classroom/course/:id/courseWork/:courseworkId', element: <ClassroomCoursework /> },
    { path: 'classroom/course/:id/courseWorkMaterial/:materialId', element: <ClassroomMaterial /> },
    { path: 'library', element: <Library /> },
    { path: 'library/search', element: <LibrarySearch /> },
    { path: 'library/bookmarks', element: <LibraryBookmarks /> },
    // ... 他のルート
  ],
}
```

**変更後（ネスト）:**
```typescript
{
  path: '/',
  element: <RequireLogin />,
  errorElement: <ErrorFallback />,  // 認証済みルート共通のエラーハンドラ
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'status', element: <Status /> },

    // 時間割
    { path: 'timetable', element: <Timetable /> },
    { path: 'timetable/editor', element: <MyTimetable /> },

    // イベント
    { path: 'events', element: <Events /> },
    { path: 'events/:id', element: <EventDetail /> },

    // 投稿
    {
      path: 'posts',
      element: <Posts />,
      children: [
        { path: 'hatoboard', element: <Hatoboard /> },
      ],
    },
    { path: 'posts/:id', element: <PostDetail /> },

    // 図書館
    { path: 'library', element: <Library /> },
    { path: 'library/search', element: <LibrarySearch /> },
    { path: 'library/bookmarks', element: <LibraryBookmarks /> },

    // Google Classroom
    { path: 'classroom', element: <Classroom /> },
    { path: 'classroom/bookmarks', element: <ClassroomBookmarks /> },
    { path: 'classroom/course/:id', element: <ClassroomCourse /> },
    { path: 'classroom/course/:id/announcement/:announcementId', element: <ClassroomAnnouncement /> },
    { path: 'classroom/course/:id/courseWork/:courseworkId', element: <ClassroomCoursework /> },
    { path: 'classroom/course/:id/courseWorkMaterial/:materialId', element: <ClassroomMaterial /> },

    // クラスマッチ
    { path: 'classmatch/:year?', element: <Classmatch /> },

    // 交通
    { path: 'transit', element: <Transit /> },

    // 設定
    {
      path: 'settings',
      element: <Settings />,
      children: [
        { index: true, element: <SettingsTop /> },
        { path: 'account', element: <SettingsAccount /> },
        { path: 'theme', element: <SettingsTheme /> },
        { path: 'notification', element: <SettingsNotification /> },
      ],
    },
  ],
}
```

### Step 2: クエリパラメータをパスから分離する

**変更前:**
```typescript
{ path: 'timetable/editor/search?', element: <MyTimetable /> }
```

**変更後:**
```typescript
{ path: 'timetable/editor', element: <MyTimetable /> }
```

`MyTimetable` コンポーネント内で `useSearchParams()` を使ってクエリパラメータを取得する。

```typescript
import { useSearchParams } from 'react-router';

function MyTimetable() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  // ...
}
```

**注意:** 既存のナビゲーションリンクで `timetable/editor/search?query=...` の形で遷移している箇所がないか確認する。

```bash
grep -rn "timetable/editor" src/ --include="*.tsx" --include="*.ts"
```

### Step 3: errorElement の重複削減

認証済みルートの親に `errorElement` を1つ指定することで、子ルート個別の指定を不要にする。

```typescript
{
  path: '/',
  element: <RequireLogin />,
  errorElement: <ErrorFallback />,  // 子ルート共通
  children: [
    // 個別の errorElement は不要
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'events', element: <Events /> },
    // ...
  ],
}
```

**注意:** 特定のルートで異なるエラー UI が必要な場合は、そのルートのみ `errorElement` を指定する。

### Step 4: ルートコメントの追加

ルートグループにコメントを追加して可読性を向上させる（Step 1 の例のように）。

## 確認事項

- [ ] 全てのページへの遷移が正常に動作するか確認
- [ ] ブラウザの戻る・進むが正常に動作するか確認
- [ ] `timetable/editor` への遷移でクエリパラメータが正常に処理されるか確認
- [ ] エラー発生時に ErrorFallback が表示されるか確認
- [ ] `yarn build` が成功するか確認

## 関連ファイル

- `src/routes.tsx` — 主な変更対象
- `src/pages/MyTimetable.tsx` — クエリパラメータ処理の確認
