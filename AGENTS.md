# Hato

屋代高校向け学校情報プラットフォームのフロントエンド（React SPA / PWA）。UI の文言は日本語。

## コマンド

```bash
yarn install
yarn dev               # 開発サーバー (port 3000)。実機確認は yarn dev --host
yarn dev:local-api     # ローカル API (.env.local-api) に接続
yarn build             # 本番ビルド (tsc はビルドに含まれないので型は下で確認)
npx tsc --noEmit       # 型チェック
yarn lint              # ESLint (0 errors が必須。既存の warning 3 件は許容)
yarn format            # Prettier
yarn test              # Vitest (単発実行)。開発中は yarn test:watch
```

**作業の完了条件:** `yarn format` → `yarn lint` → `npx tsc --noEmit` → `yarn build` → `yarn test` がすべて通ること。
CI（`.github/workflows/test.yml`）は lint / build / test を実行する。

## 技術スタック

React 18 + TypeScript 5.7 (strict) + Vite 6 / Chakra UI v3（カラーモードは next-themes）/ React Router v7 /
TanStack Query 5 + ky 2 / Jotai 2 / Vitest 2 + Testing Library (jsdom) / vite-plugin-pwa (Workbox)

## 実装の規約

- **パス:** `@/*` → `src/*`。グローバル型は `src/@types/*.d.ts`。
- **ページ:** `src/pages/` に置き、`src/routes.tsx` で `React.lazy()` 登録する。
- **データ取得:** `src/services/<feature>/` に TanStack Query フックを置く（例: `src/services/scienceroom/index.ts`）。
  クエリキーは必ず `src/services/queryKeys.ts` のファクトリを使い、文字列配列を直書きしない。
- **API クライアント:** `useClient()`（`src/modules/client/index.ts`）。JWT 付与・401 時のリフレッシュはここで行う。
  ky 2 のフックは `({ request, response })` のオブジェクト引数。旧シグネチャ `(request, options, response)` は動かない。
- **グローバル状態:** Jotai。永続化する atom は `createVersionedStorage()`（`src/utils/versionedStorage.ts`）と
  `hato.` プレフィックスのキーを使う。保存する型を変えたら `version` を上げて `migrate` を書く。
- **アイコン:** `react-icons/tb`（Tabler）のみ。

## Chakra UI v3 の注意点

v2 から移行済み。経緯は `docs/chakra-v3-migration-status.md`、見た目の規約は `docs/design-system.md` を参照。

- v2 の API は使わない: `spacing`→`gap`、`colorScheme`→`colorPalette`、`isOpen`→`open`、`isDisabled`→`disabled`、
  `Modal`→`Dialog`、`useToast`→`toaster.create()`、`useColorModeValue` は `@/components/ui/color-mode` から。
- Dialog / Drawer / Menu / Tooltip / Switch / Tag / Avatar などは `src/components/ui/` の snippet を使う。
  snippet と `src/theme.ts` は全画面に効くため、変更したら VRT（`scripts/vrt/README.md`）で v2 との差分を確認する。
- `src/theme.ts` は v2 の見た目に合わせる上書きが多い。`bg` / `border` セマンティックトークンは
  グループ直下ではなく `DEFAULT` キーで上書きする（直下に書くとダークモードが壊れる）。
- `textStyle` を渡すと recipe 側の `textStyle`（文字サイズ）が消える。サイズは `fontSize` で指定する。
- Menu / Popover などのトリガー要素に `id` を付けない（位置計算が壊れる）。必要なら Root の `ids={{ trigger }}` で指定する。
- `lineClamp` を Link など `align-items: center` を持つ要素に付けると、Safari で中央寄せになる。`alignItems="flex-start"` を併記する。

## テスト

- `*.test.ts(x)` をソースの隣に置く。`describe` / `it` / `expect` / `vi` はグローバル。
- コンポーネントは `renderWithProviders()`（`src/test/utils.tsx`）、Jotai atom は `createStore()` で独立させてテストする。
- 見た目に関わる変更は `scripts/vrt/` で v2 (dev) とのスクリーンショット比較ができる。

## Git

- 作業ブランチ → `dev` へ PR → `dev` を `master` にマージしてリリース。`master` / `dev` に直接 push しない。
- コミットメッセージは Conventional Commits + 日本語（例: `fix(chakra-v3): Tabs の非選択色を v2 に合わせる`）。
- pre-commit で Husky + lint-staged（`eslint --fix` / `prettier`）が走る。

## 境界

- ✅ **常に:** 完了条件のコマンドを通す。ロジックを変えたらテストを追加・更新する。
- ⚠️ **先に確認:** 依存パッケージの追加・メジャー更新。`src/theme.ts` や `src/components/ui/` の広範な変更。
  永続 atom の保存形式の変更。ルート URL の変更。push と PR の作成。
- 🚫 **しない:** `.env.*` に秘密情報を書く（`VITE_` 変数はビルドに埋め込まれ公開される。`.env.*` は git 管理下）。
  失敗するテストを削除・skip して通す。`--no-verify` で pre-commit を飛ばす。

## 参照

- `docs/design-system.md` — カラートークン、テキストスタイル、部品パターン
- `docs/chakra-v3-migration-status.md` — v3 移行の内容と経緯
- `scripts/vrt/README.md` — v2/v3 のビジュアル比較
- `docs/TODO.md`、`docs/guides/` — 設計レビューで挙がった改善項目と手順書
