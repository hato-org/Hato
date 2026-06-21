# Chakra UI v2 → v3 移行 — 完了報告

ブランチ: `feat/chakra-v3-migration`（`master` から分岐）

## 結果サマリ

- 型エラー **471 → 0**（100%解消）。構文エラー 0 を全工程で維持。
- **`yarn format` / `yarn lint`（exit 0） / `yarn build` / `yarn test`（136/136） 全てパス**。
- 残 lint 警告は 3件のみ（`react-hooks/exhaustive-deps`、いずれも移行前から存在する意図的な依存配列。Chakra 無関係）。

## 移行の内訳（このブランチで実施）

### 一括 codemod / 機械的変換
- `useToast` → `toaster.create()`（16ファイル）。`status:`→`type:`、placement を `top-end` に統一、duration は呼び出し元のラッパーで保持。
- `as={RouterLink|Link} to/href` → `asChild` + 子に Link/RouterLink を内包（33箇所）。
- `isLoaded={!x}` → `loading={x}`（Skeleton、全ファイル）。
- `align`→`textAlign`（Text）、`sx`→`css`。

### 名前空間／snippet コンポーネント
- Menu → `MenuRoot/MenuTrigger asChild/MenuContent/MenuItem(value必須)`、`icon=`→子要素。
- Switch / Checkbox → snippet（`checked`/`onCheckedChange`、`e.checked`）。
- Tag / Avatar / Tooltip / Popover / NumberInput / Progress / Checkbox → snippet。
- Table → `Table.Root/Header/Body/Row/ColumnHeader/Cell/ScrollArea`。
- Tabs → `Tabs.Root/List/Trigger/Content`（value ベース、`isFitted`→`fitted`、`onChange`→`onValueChange`）。
- Accordion → `Accordion.Root/Item(value必須)/ItemTrigger/ItemContent/ItemBody`（`allowToggle`→`collapsible` 等）。
- Alert → `Alert.Root/Indicator/Title/Description/Content`。
- AlertDialog → Dialog snippet + `role="alertdialog"`。
- `UnorderedList/OrderedList/ListItem` → `List.Root(as="ol")/List.Item`。
- `Slide/Fade` → `Presence`（animationName）／条件レンダリング。
- `Show below/above` → Box `hideFrom`/`hideBelow`。
- isInvalid → `Field.Root invalid={..}` でラップ。
- InputGroup → `startElement/endElement`。
- `useClipboard` → `{ copy, copied }`、`useBoolean` → `useState`。

### Chakra 無関係だが移行で表面化した実バグ（修正済み）
- **`modules/client/index.ts`**: `moduleResolution: Node→Bundler` により ky の本物の型が解決され、`afterResponse` フックが旧3引数 API のままだったことが判明（新 ky は単一 `state` 引数）。**実行時に response が undefined になる潜在バグを修正**。
- **`services/queryKeys.ts`**: optional な値（`string | undefined`）を `string` 必須のキー関数へ渡していた型穴を、キー関数側の引数を optional 化して解消。
- **`test/setup.ts`**: next-themes（v3 color-mode）が `window.matchMedia` を要求するため jsdom 用モックを追加。
- `RequireLogin.test.tsx`: vitest の `vi.fn<[args]>` → `vi.fn<(...)=>...>`。

## 検証コマンド
```bash
yarn format && yarn lint && yarn build && yarn test   # 全てパス
npx tsc --noEmit 2>&1 | grep -c "error TS"            # 0
```

## 残作業（任意・スコープ外）
- light/dark 両モードでの手動ビジュアル QA（主要ルート: ホーム/投稿カード, カレンダー(Drawer),
  ライブラリ(BookInfo), classmatch(Dialog/Popover), 設定(Switch/テーマ), ヘッダー/ナビ(Menu), Tooltip/Toast）。
  特に挙動を変えた箇所: toaster placement(top-end), hover Popover→Tooltip(2箇所),
  Slide/Fade→Presence のアニメーション、BookInfo の Image fallback の条件レンダリング化。
- 既存の `react-hooks/exhaustive-deps` 警告3件（移行前から）。
- 一回限りの codemod スクリプト（`scripts/migrate_*.py`）は削除済み。
