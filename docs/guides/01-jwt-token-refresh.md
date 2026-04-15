# 01: JWT トークンリフレッシュの実装

## 現状の問題

- `src/modules/auth/index.ts` でログイン時に JWT を取得するが、トークンの有効期限管理が一切ない
- トークン期限切れ時は `src/modules/client/index.ts` の 401 インターセプタで即座にログアウト＋ハードリロードされる
- ユーザーは作業中のフォーム入力等を全て失い、再ログインを強いられる

## 目標

- トークン期限切れが近づいたら自動的にリフレッシュする
- リフレッシュ失敗時のみログアウトに遷移する
- 複数リクエストが同時に 401 を受けた場合、リフレッシュリクエストは1回だけ発行する

## 前提条件

- バックエンド API に `POST /auth/refresh` エンドポイントが存在する（または新設する）こと
- リフレッシュ時に現在の JWT を送信し、新しい JWT を受け取る設計とする

## 実装手順

### Step 1: リフレッシュ用ユーティリティの作成

`src/modules/auth/refresh.ts` を新規作成する。

```typescript
import ky from 'ky';
import { getDefaultStore } from 'jotai';
import { jwtAtom, clearAuth } from '@/store/auth';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

let refreshPromise: Promise<string> | null = null;

/**
 * JWT をリフレッシュする。
 * 複数の 401 レスポンスが同時に発生しても、リフレッシュリクエストは1回のみ。
 */
export const refreshToken = async (): Promise<string | null> => {
  // 既にリフレッシュ中ならそのPromiseを返す（重複防止）
  if (refreshPromise) return refreshPromise;

  const store = getDefaultStore();
  const currentJwt = store.get(jwtAtom);

  if (!currentJwt) return null;

  refreshPromise = (async () => {
    try {
      const { jwt } = await ky
        .post('auth/refresh', {
          prefix: API_URL,
          headers: { Authorization: `Bearer ${currentJwt}` },
        })
        .json<{ jwt: string }>();

      store.set(jwtAtom, jwt);
      return jwt;
    } catch {
      clearAuth();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
```

### Step 2: ky クライアントにリフレッシュロジックを組み込む

`src/modules/client/index.ts` を修正する。

**変更前:**
```typescript
hooks: {
  afterResponse: [
    ({ response }) => {
      if (response.status === 401) {
        clearAuth();
        window.location.replace(
          `/login?return_to=${encodeURIComponent(...)}`
        );
      }
    },
  ],
},
```

**変更後:**
```typescript
hooks: {
  afterResponse: [
    async (request, _options, response) => {
      if (response.status === 401) {
        const newJwt = await refreshToken();
        if (newJwt) {
          // リフレッシュ成功: 新しいトークンでリトライ
          request.headers.set('Authorization', `Bearer ${newJwt}`);
          return ky(request);
        }
        // リフレッシュ失敗: ログインページへ（React Router経由は #02 で対応）
        clearAuth();
        window.location.replace(
          `/login?return_to=${encodeURIComponent(window.location.pathname + window.location.search)}`
        );
      }
    },
  ],
},
```

### Step 3: プロアクティブなトークンリフレッシュ（オプション）

JWT のペイロードから `exp` を読み取り、期限の5分前にリフレッシュを発火するタイマーを設定する。

`src/modules/auth/useTokenRefresh.ts` を新規作成する。

```typescript
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { jwtAtom } from '@/store/auth';
import { refreshToken } from './refresh';

const parseJwtExp = (jwt: string): number | null => {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return payload.exp ?? null;
  } catch {
    return null;
  }
};

/**
 * JWT の有効期限5分前に自動リフレッシュを行うフック。
 * App.tsx または RequireLogin で呼び出す。
 */
export const useTokenRefresh = () => {
  const jwt = useAtomValue(jwtAtom);

  useEffect(() => {
    if (!jwt) return;

    const exp = parseJwtExp(jwt);
    if (!exp) return;

    const now = Math.floor(Date.now() / 1000);
    const refreshIn = (exp - now - 5 * 60) * 1000; // 期限の5分前

    if (refreshIn <= 0) {
      // 既に期限切れ間近: 即座にリフレッシュ
      refreshToken();
      return;
    }

    const timer = setTimeout(() => {
      refreshToken();
    }, refreshIn);

    return () => clearTimeout(timer);
  }, [jwt]);
};
```

### Step 4: フックの組み込み

`src/components/login/RequireLogin.tsx` で `useTokenRefresh()` を呼び出す。

```typescript
import { useTokenRefresh } from '@/modules/auth/useTokenRefresh';

function RequireLogin() {
  useTokenRefresh();
  // ... 既存のロジック
}
```

## 確認事項

- [ ] バックエンドの `POST /auth/refresh` エンドポイントが利用可能か確認
- [ ] リフレッシュ成功時にトークンが正しく更新され、以降のリクエストに使われるか確認
- [ ] リフレッシュ失敗時に適切にログアウトされるか確認
- [ ] 複数タブでの同時リフレッシュが競合しないか確認
- [ ] トークン有効期限5分前のプロアクティブリフレッシュが動作するか確認

## 関連ファイル

- `src/modules/auth/index.ts` — 既存の認証フック
- `src/modules/client/index.ts` — ky クライアント設定
- `src/store/auth.ts` — JWT/User アトム
- `src/components/login/RequireLogin.tsx` — 認証ガード
