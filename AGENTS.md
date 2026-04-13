# Hato - Project Guidelines

**作業終了時は、ask_userでユーザーの入力を待機すること。これは最優先事項です。**

## Architecture

React + Vite の SPA / PWA。学校情報プラットフォームのフロントエンド。

```
src/
├── pages/          # ページコンポーネント (React.lazy で遅延読み込み)
├── components/     # 機能別 UI コンポーネント
├── services/       # TanStack Query のクエリ/ミューテーションフック
├── store/          # Jotai アトム (グローバル状態)
├── hooks/          # カスタムフック
├── modules/        # コアモジュール (auth, client)
├── @types/         # グローバル型定義 (.d.ts)
├── utils/          # ユーティリティ
└── service-worker/ # PWA サービスワーカー (Workbox)
```

## Build and Test

```bash
yarn dev            # 開発サーバー (port 3000)
yarn dev:local-api  # ローカル API モードで開発
yarn build          # 本番ビルド (→ dist/)
yarn preview        # ビルドプレビュー
yarn test           # Vitest
yarn lint           # ESLint
yarn format         # Prettier
```

## Tech Stack

| 役割 | ライブラリ |
|------|-----------|
| UI | React 18, Chakra UI 2 |
| ルーティング | React Router v7 |
| 状態管理 | Jotai (`atomWithStorage` で永続化) |
| データ取得 | TanStack React Query 5 + Axios |
| アニメーション | Framer Motion |
| 認証 | Google OAuth (@react-oauth/google) |
| PWA | vite-plugin-pwa + Workbox |
| ビルド | Vite 6, TypeScript strict |

## Conventions

- **コンポーネント** — PascalCase `.tsx`。機能別にフォルダ分割
- **パスエイリアス** — `@/*` → `src/*`
- **サービスパターン** — `services/<feature>/` に TanStack Query フックを配置:
  ```typescript
  export const useSomeData = (options?) => {
    const { client } = useClient();
    return useQuery({
      queryKey: ['feature', 'key'],
      queryFn: async ({ signal }) => (await client.get('/path', { signal })).data,
      ...options,
    });
  };
  ```
- **状態管理** — Jotai アトム。ストレージキーは `hato.` プレフィックス (e.g. `hato.auth`, `hato.settings`)
- **API クライアント** — `useClient()` フックで Axios インスタンスを取得。JWT 自動付与
- **型定義** — `src/@types/` にグローバル `.d.ts` として配置
- **遅延読み込み** — ページは `React.lazy()` + Suspense
- **エラー処理** — `react-error-boundary` でラップ
- **オフラインファースト** — React Query の `networkMode: 'offlineFirst'`、IndexedDB 永続化 (24h)
- **pre-commit** — Husky + lint-staged (ESLint + Prettier)

## Key Files

- [src/App.tsx](src/App.tsx) — ルートコンポーネント
- [src/routes.tsx](src/routes.tsx) — ルート定義
- [src/theme.ts](src/theme.ts) — Chakra UI テーマ
- [src/modules/client/index.ts](src/modules/client/index.ts) — API クライアント設定
- [src/modules/auth/index.ts](src/modules/auth/index.ts) — 認証フック
- [CONTRIBUTING.md](CONTRIBUTING.md) — コントリビューションガイド
