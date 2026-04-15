# 02: 401 レスポンス処理の改善

## 現状の問題

- `src/modules/client/index.ts` (L26) で `window.location.replace()` によるハードリロードを行っている
- React Router のナビゲーション外で遷移するため、React の状態（フォーム入力等）が全て失われる
- ユーザー体験が著しく低下する

## 目標

- 401 発生時に React Router を使ったソフトナビゲーションでログインページに遷移する
- `return_to` パラメータを保持し、ログイン後に元のページに戻れるようにする
- トークンリフレッシュ (#01) との連携を前提とする

## 実装手順

### Step 1: ナビゲーション参照の作成

ky の `afterResponse` フックは React コンポーネントツリーの外で実行されるため、`useNavigate()` を直接使えない。
グローバルにアクセス可能なナビゲーション関数を作成する。

`src/modules/common/navigation.ts` を新規作成する。

```typescript
import type { NavigateFunction } from 'react-router';

let navigateFn: NavigateFunction | null = null;

export const setNavigateFunction = (fn: NavigateFunction) => {
  navigateFn = fn;
};

export const getNavigateFunction = () => navigateFn;
```

### Step 2: App.tsx でナビゲーション関数を登録する

ky フックからナビゲーションを使うためには、RouterProvider のコンテキスト内で `useNavigate()` を取得し登録する必要がある。
ルートレイアウトコンポーネントを作成するのが最も適切。

`src/components/layout/RootLayout.tsx` を新規作成（または既存のレイアウトに追加）する。

```typescript
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { setNavigateFunction } from '@/modules/common/navigation';

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return <Outlet />;
}
```

`src/routes.tsx` のルート定義でこのレイアウトをラップする。

```typescript
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      {
        path: '/',
        element: <RequireLogin />,
        children: [
          // ... 既存の認証済みルート
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
```

### Step 3: ky クライアントの 401 処理を修正する

`src/modules/client/index.ts` を修正する。

**変更前:**
```typescript
if (response.status === 401) {
  clearAuth();
  window.location.replace(
    `/login?return_to=${encodeURIComponent(window.location.pathname + window.location.search)}`
  );
}
```

**変更後:**
```typescript
import { getNavigateFunction } from '@/modules/common/navigation';

// ...

if (response.status === 401) {
  // #01 のトークンリフレッシュが失敗した場合にここに到達する
  clearAuth();
  const navigate = getNavigateFunction();
  const returnTo = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  if (navigate) {
    navigate(`/login?return_to=${returnTo}`, { replace: true });
  } else {
    // フォールバック（Router 未初期化時）
    window.location.replace(`/login?return_to=${returnTo}`);
  }
}
```

### Step 4: ログインページで return_to を処理する

`src/pages/Login.tsx` で `return_to` パラメータを読み取り、ログイン成功後にリダイレクトする。

```typescript
import { useSearchParams } from 'react-router';

// ログインページ内
const [searchParams] = useSearchParams();
const returnTo = searchParams.get('return_to') ?? '/dashboard';

// ログイン成功後
navigate(returnTo, { replace: true });
```

## 確認事項

- [ ] 401 発生時にログインページにソフト遷移するか確認
- [ ] フォーム入力中に 401 が発生した場合、ログイン後に元のページに戻れるか確認
- [ ] React Router 未初期化時（起動直後等）のフォールバックが動作するか確認
- [ ] 複数リクエストが同時に 401 を受けた場合に二重遷移しないか確認

## 関連ファイル

- `src/modules/client/index.ts` — ky クライアント（主な変更対象）
- `src/routes.tsx` — ルート定義
- `src/pages/Login.tsx` — ログインページ
