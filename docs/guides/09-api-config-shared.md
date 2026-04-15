# 09: API 設定の共通化

## 現状の問題

- API URL の計算ロジックが2箇所で重複している
  - `src/modules/auth/index.ts` (L11-13)
  - `src/modules/client/index.ts` (L6-8)
- 同じ三項演算子: `import.meta.env.DEV ? window.location... : import.meta.env.VITE_API_URL`
- タイムアウト値 (`15000ms`) もクライアントにハードコードされている
- Google OAuth の `hosted_domain` もハードコード (`'g.nagano-c.ed.jp'`)

## 目標

- API 関連の設定値を1つの共有設定ファイルに集約する
- 環境変数からの読み取りを一元化する

## 実装手順

### Step 1: 共有設定ファイルを作成する

`src/config/api.ts` を新規作成する。

```typescript
export const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

export const API_TIMEOUT = 15_000; // 15秒

export const GOOGLE_OAUTH = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  hostedDomain: import.meta.env.VITE_GOOGLE_OAUTH_DOMAIN as string | undefined
    ?? 'g.nagano-c.ed.jp',
} as const;
```

### Step 2: auth モジュールを更新する

`src/modules/auth/index.ts`:

**変更前:**
```typescript
const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;
```

**変更後:**
```typescript
import { API_URL, GOOGLE_OAUTH } from '@/config/api';

// L106 も更新
// hosted_domain: 'g.nagano-c.ed.jp',
// ↓
// hosted_domain: GOOGLE_OAUTH.hostedDomain,
```

### Step 3: client モジュールを更新する

`src/modules/client/index.ts`:

**変更前:**
```typescript
const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

// ...
timeout: 1000 * 15,
```

**変更後:**
```typescript
import { API_URL, API_TIMEOUT } from '@/config/api';

// ...
timeout: API_TIMEOUT,
```

### Step 4: main.tsx の clientId 参照を更新する（オプション）

```typescript
// 変更前
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

// 変更後
import { GOOGLE_OAUTH } from '@/config/api';
<GoogleOAuthProvider clientId={GOOGLE_OAUTH.clientId}>
```

### Step 5: 環境変数の型定義を追加する（オプション）

`src/vite-env.d.ts` に環境変数の型を追加する。

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_OAUTH_DOMAIN?: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 確認事項

- [ ] `yarn build` が成功するか確認
- [ ] 開発モード (`yarn dev`) で API プロキシが正常に動作するか確認
- [ ] 本番ビルドで `VITE_API_URL` が正しく使用されるか確認
- [ ] Google OAuth ログインが正常に動作するか確認

## 関連ファイル

- `src/modules/auth/index.ts` — API_URL の重複削除
- `src/modules/client/index.ts` — API_URL の重複削除
- `src/main.tsx` — clientId の参照元変更（オプション）
- `src/vite-env.d.ts` — 環境変数の型定義
