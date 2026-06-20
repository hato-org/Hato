# Chakra UI v2 → v3 移行 — 進捗・ハンドオフ

ブランチ: `feat/chakra-v3-migration`（`master` から分岐）

## 現状サマリ

- 型エラー **972 → 471**（約52%削減）。`yarn build` はまだ通らない（移行途中）。
- 基盤は完全クリーン（snippet 0エラー）。WIPコミットは `git log master..HEAD` 参照。
- 残り **471エラー / 106ファイル** は「名前空間化コンポーネント」の個別移行のみ。

## 完了済み（検証済み・コミット済み）

| 項目 | 方法 | 規模 |
|---|---|---|
| 依存導入（@chakra-ui/react v3.36, chakra-react-select v6, next-themes） | yarn | — |
| 全 snippet 生成（`src/components/ui/`） | @chakra-ui/cli | — |
| `theme.ts` → `createSystem(defineConfig)` | 手動 | 1 |
| Provider 差し替え（main.tsx / test/utils.tsx / RequireLogin.test） | 手動 | 3 |
| **tsconfig `moduleResolution: Node→Bundler`**（namespace型解決の根因） | 手動 | 1 |
| color-mode フック → `@/components/ui/color-mode` | 手動 | 6 |
| `spacing→gap` `noOfLines→lineClamp` `StackDivider/Divider→*Separator` | Python | ~110 |
| boolean props（isDisabled/isLoading/isRound/isExternal） | Python | 52 |
| `IconButton icon=` → children | codemod | 30 |
| `Button leftIcon/rightIcon` → children | codemod | 20 |
| `Collapse` → `Collapsible.Root/Content` | codemod | 18 |
| `Modal` → Dialog snippet | codemod | 17 |
| `Drawer` → Drawer snippet | codemod | 6 |
| `useDisclosure().isOpen` → `open`（エイリアス） | Python | 26 |

再利用可能な codemod: `scripts/migrate_*.py`（最終マージ前に削除すること）。

## 残務（次セッションで一気に）

名前空間化コンポーネントの個別移行。各々構造が異なり一括スクリプト不可。

| コンポーネント | 件数 | 移行先（snippet/namespace） |
|---|---|---|
| Menu(30) | `<Menu><MenuButton><MenuList><MenuItem>` | `MenuRoot`/`MenuTrigger asChild`/`MenuContent`/`MenuItem value="…"`（**value必須**）。snippet: `@/components/ui/menu` |
| Tag(26) | `<Tag><TagLeftIcon as=><TagLabel>` | snippet `<Tag startElement={<Icon as=/>}>label</Tag>`（`@/components/ui/tag`） |
| Switch(16) | `isChecked`/`onChange` | snippet `<Switch checked onCheckedChange>`（`@/components/ui/switch`） |
| Alert(16) | `<Alert status><AlertIcon>text` | `<Alert.Root><Alert.Indicator/><Alert.Title>text</Alert.Title></Alert.Root>` |
| Avatar(12) | `<Avatar src icon=>` | snippet `<Avatar src name icon>`（`@/components/ui/avatar`） |
| Tooltip(8) | `label=` | snippet `<Tooltip content={…}>`（`@/components/ui/tooltip`）。`label→content` |
| Table(8) | `Table/Thead/Tbody/Tr/Th/Td/TableContainer` | `Table.Root/Header/Body/Row/ColumnHeader/Cell/ScrollArea` |
| Popover(8) | `<Popover><PopoverTrigger><PopoverContent>` | snippet（`@/components/ui/popover`）。`isOpen→open` |
| Accordion(8) | `Accordion/AccordionItem/Button/Panel` | `Accordion.Root/Item/ItemTrigger/ItemContent`（item に `value` 必須） |
| Checkbox(6) | `isChecked/onChange` | snippet（`@/components/ui/checkbox`） |
| Tabs(6) | `Tabs/TabList/Tab/TabPanels/TabPanel` | `Tabs.Root/List/Trigger/Content`（`value` ベース） |
| Progress(4) | `isIndeterminate`/`value` | snippet `ProgressRoot`（`@/components/ui/progress`） |
| NumberInput(3) | `NumberInput*Stepper` | snippet（`@/components/ui/number-input`） |
| AlertDialog(2) | `AlertDialog*` | Dialog snippet + `role="alertdialog"` |
| Slide/Fade(4) | `<Slide/Fade in=>` | `<Presence present= animationName=>` |
| useBoolean(3)/useClipboard(~3) | removed | `useState` / clipboard snippet。`onCopy`/`hasCopied` API変更 |

その他個別: `useDisclosure({ defaultIsOpen })` → `defaultOpen`、`Image fallback=`、`Spinner`、`isInvalid`（→ Field）、`Tabs`/`List`（UnorderedList/OrderedList → `List.Root/Item`）。

## 検証手順（残務完了後）

```bash
yarn format && yarn lint && yarn build && yarn test   # 全てパスさせる（AGENTS.md）
```
- 136テスト中 role/DOM 変化で落ちるもの（Dialog等）を修正。
- 主要ルートを **light/dark 両モード**で手動ビジュアルQA:
  ホーム/投稿カード, カレンダー(Drawer), ライブラリ(BookInfo), classmatch(Dialog),
  設定(テーマ切替/Switch), ヘッダー/ナビ(Menu), Tooltip/Popover/Toast。

## 真の残エラー確認コマンド

```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"           # 総数
npx tsc --noEmit 2>&1 | grep -cE "TS1005|TS17002"    # 構文エラー(0であること; codemod破損検知)
```
注意: 構文エラーがあると型解析が止まり「エラー激減」に見える罠がある（必ず TS1005/17002 を 0 に保つ）。
