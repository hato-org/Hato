# Hato - Project Guidelines

**作業終了時は、ask_userでユーザーの入力を待機すること。これは最優先事項です。全ての作業でこれを遵守してください。**

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
| データ取得 | TanStack React Query 5 + ky |
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
- **API クライアント** — `useClient()` フックで ky インスタンスを取得。JWT 自動付与
- **型定義** — `src/@types/` にグローバル `.d.ts` として配置
- **遅延読み込み** — ページは `React.lazy()` + Suspense
- **エラー処理** — `react-error-boundary` でラップ
- **オフラインファースト** — React Query の `networkMode: 'offlineFirst'`、IndexedDB 永続化 (24h)
- **pre-commit** — Husky + lint-staged (ESLint + Prettier)

## Design System

テーマ定義は [src/theme.ts](src/theme.ts)。Chakra UI 2 のセマンティックトークンとカスタムスタイルで構成。

### カラートークン

セマンティックカラー (ライト / ダーク):

| トークン | Light | Dark | 用途 |
|---------|-------|------|------|
| `title` | gray.700 | gray.100 | 見出し・本文 |
| `description` | gray.500 | gray.400 | 補足テキスト |
| `bg` | white | bg.900 (#121212) | ページ背景 |
| `panel` | white | #202020 | カード・モーダル背景 |
| `border` | bg.100 | bg.800 | ボーダー |
| `hover` | blackAlpha.100 | whiteAlpha.100 | ホバー状態 |
| `active` | blackAlpha.200 | whiteAlpha.200 | アクティブ状態 |
| `success` | green.400 | green.500 | 成功 |
| `warning` | yellow.400 | yellow.500 | 警告 |
| `error` | red.400 | red.500 | エラー |

アクセントカラー: `blue.400` / `blue.500` (スピナー、リンク、ボタン)

### テキストスタイル

```
textStyle="title"       — fontWeight: bold, color: title
textStyle="description" — fontSize: sm, color: description
textStyle="link"        — color: blue.500, underline, cursor: pointer
```

### レイヤースタイル

```
layerStyle="button" — border: 1px solid transparent, hover: bg hover, active: bg active, transition: .2s ease
```

### スペーシング規約

- カード内パディング: `p={4}`
- カード間スペーシング: `spacing={8}`
- 小要素間: `spacing={1}` 〜 `spacing={2}`
- フローティング要素用下マージン: `mb={16}` 〜 `mb={40}`

### コンポーネントパターン

**Card** — `bg="panel"`, `rounded="xl"`, `shadow="xl"`, `border="1px solid"`, `borderColor="border"`, `p={4}`

**Header** — `position="sticky"`, `bg="bgAlpha"`, `backdropBlur="8px"` (グラスモーフィズム), `shadow="xl"`, `zIndex={10}`

**ボタン** — `rounded="lg"`, `colorScheme="blue"` (プライマリ), `variant="ghost"` (セカンダリ)

**モーダル** — `ModalContent`: `rounded="xl"`, `bg="panel"`. フッターボタン: `w="full"`, `rounded="lg"`

**メニュー** — `MenuList`: `shadow="lg"`, `rounded="xl"`. `MenuItem`: `textStyle="title"`

### エラー表示

```
<Center w="100%">
  <VStack>
    <Icon as={TbAlertCircle} w={16} h={16} color="warning" or "error" />
    <Text textStyle="description">{error.message}</Text>
    <Text textStyle="title">{userFriendlyMessage}</Text>
  </VStack>
</Center>
```

- 警告系 (4xx): `color="yellow.500"`
- エラー系 (5xx): `color="red.500"`

### アイコン

- ライブラリ: `react-icons/tb` (Tabler Icons, `Tb` プレフィックス)
- サイズ: インライン `w={5} h={5}`, 標準 `w={6} h={6}`, 大型表示 `w={16} h={16}`

### アニメーション

- トランジション: `transition="all .2s ease"` (統一)
- Framer Motion ラッパー: `MotionFlex`, `MotionCenter`, `MotionVStack`, `MotionHStack`
- ローディング: `Spinner color="blue.400" thickness="3px"`

### レスポンシブ

- ブレークポイント: `base` (モバイル) / `md` (タブレット) / `lg` (デスクトップ)
- モバイルファースト設計。`useBreakpointValue` でレスポンシブ切替

### フォント

`-apple-system, Inter, "Noto Sans JP Variable", sans-serif` — heading / body 共通

## Key Files

- [src/App.tsx](src/App.tsx) — ルートコンポーネント
- [src/routes.tsx](src/routes.tsx) — ルート定義
- [src/theme.ts](src/theme.ts) — Chakra UI テーマ
- [src/modules/client/index.ts](src/modules/client/index.ts) — API クライアント設定
- [src/modules/auth/index.ts](src/modules/auth/index.ts) — 認証フック
- [CONTRIBUTING.md](CONTRIBUTING.md) — コントリビューションガイド
