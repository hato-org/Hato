# デザインシステム

テーマ定義は `src/theme.ts`（Chakra UI v3 の `createSystem`）。
v3 のデフォルトは v2 と寸法・配色が異なるため、v2 当時の見た目に合わせる上書きを多く含む。

## カラートークン

セマンティックトークン（light / dark）:

| トークン | Light | Dark | 用途 |
|---------|-------|------|------|
| `title` | gray.700 | gray.100 | 見出し・本文 |
| `description` | gray.500 | gray.400 | 補足テキスト |
| `bg` | white | bg.900 (#121212) | ページ背景 |
| `bgAlpha` | whiteAlpha.800 | rgba(18,18,18,.8) | ヘッダーなど半透明の背景 |
| `panel` | white | bg.850 (#202020) | カード・ダイアログの背景 |
| `border` | bg.100 | bg.800 | ボーダー |
| `hover` / `active` | blackAlpha.100 / 200 | whiteAlpha.100 / 200 | ホバー・押下状態 |
| `success` / `warning` / `error` | green / yellow / red.400 | 同 .500 | 状態表示 |

- アクセントカラーは `blue.400` / `blue.500`（スピナー、リンク、プライマリボタン）。
- `gray` / `red` / `orange` / `yellow` / `green` / `blue` / `pink` は v2 のパレットを移植している（v3 標準の色とは別物）。

## テキストスタイル・レイヤースタイル

- `textStyle="title"` — 太字のみ（色は body の `title` を継承するため、`color` で上書きできる）
- `textStyle="description"` — `sm` / `description` 色 / lineHeight 1.5
- `textStyle="link"` — `blue.500`・下線・ホバー背景
- `layerStyle="button"` — 透明ボーダー、ホバー・押下で背景色、`.2s ease`

## 部品パターン

| 部品 | 実装 / 指定 |
|------|-----------|
| カード | `src/components/layout/Card.tsx`（`bg="panel"` `rounded="xl"` `shadow="xl"` `border` `p={4}`） |
| ヘッダー | `src/components/nav/Header.tsx`（sticky、`bg="bgAlpha"` + `backdropBlur="8px"`、`zIndex={10}`） |
| ボタン | `rounded="lg"`。プライマリは `colorPalette="blue"`、セカンダリは `variant="ghost"` |
| ダイアログ | `src/components/ui/dialog.tsx`。`DialogContent` に `rounded="xl"` `bg="panel"`、フッターのボタンは `w="full"` |
| メニュー | `src/components/ui/menu.tsx`。`MenuContent` に `shadow="lg"` `rounded="xl"`、`MenuItem` は `value` 必須 |
| エラー表示 | `src/components/cards/Error.tsx`（`TbAlertCircle` を `w={16} h={16}`、4xx は `yellow.500`、5xx は `red.500`） |
| ローディング | `src/components/common/Loading.tsx`（`Spinner color="blue.400" borderWidth="3px"`） |
| アニメーション | `src/components/motion/index.tsx` の `MotionFlex` / `MotionVStack` など。トランジションは `all .2s ease` |

## スペーシング・サイズ

- カード内パディング `p={4}`、カード間 `gap={8}`、小要素間 `gap={1}`〜`gap={2}`
- フローティング要素を避ける下マージン `mb={16}`〜`mb={40}`
- アイコン: インライン `boxSize={5}`、標準 `boxSize={6}`、大きな表示 `boxSize={16}`

## レスポンシブ

- ブレークポイントは `base`（モバイル）/ `md`（タブレット）/ `lg`（デスクトップ）。モバイルファースト。
- 表示の出し分けは `hideFrom` / `hideBelow`（v2 の `Show` / `Hide` の代わり）、値の切替は `useBreakpointValue`。

## フォント

`-apple-system, Inter, "Noto Sans JP Variable", sans-serif`（heading / body 共通）。ロゴのみ Josefin Sans。
