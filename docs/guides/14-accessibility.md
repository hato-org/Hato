# 14: アクセシビリティ (a11y) 改善

## 現状の問題

- Dashboard のドラッグ＆ドロップに `role`, `aria-describedby`, `aria-roledescription` 等の ARIA 属性がない
- 一部の画像に `alt` テキストが不足している
- 非同期操作（データ読み込み、フォーム送信等）の結果をスクリーンリーダーに通知する `aria-live` リージョンがない
- フォーカス管理が不十分（モーダル表示時のフォーカストラップ等）

## 目標

- WCAG 2.1 AA レベルに準拠する
- スクリーンリーダーで主要機能が利用可能にする

## 実装手順

### Step 1: ドラッグ＆ドロップのアクセシビリティ

`@dnd-kit` はアクセシビリティ機能を組み込みで提供している。
これを有効に利用する。

```tsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

// センサーにキーボードを追加
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

// アクセシビリティ用アナウンスメント
const announcements = {
  onDragStart({ active }) {
    return `${active.data.current?.name}を掴みました`;
  },
  onDragOver({ active, over }) {
    if (over) {
      return `${active.data.current?.name}を${over.data.current?.name}の上に移動しました`;
    }
    return `${active.data.current?.name}はドロップエリア外です`;
  },
  onDragEnd({ active, over }) {
    if (over) {
      return `${active.data.current?.name}を${over.data.current?.name}の位置に移動しました`;
    }
    return `${active.data.current?.name}をドロップしました`;
  },
  onDragCancel({ active }) {
    return `ドラッグをキャンセルしました。${active.data.current?.name}は元の位置に戻りました`;
  },
};

<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  accessibility={{ announcements }}
  onDragEnd={handleDragEnd}
>
```

各ドラッグ可能アイテムに:

```tsx
<div
  role="listitem"
  aria-roledescription="並べ替え可能なカード"
  aria-label={card.name}
  {...attributes}
  {...listeners}
>
```

### Step 2: 画像の alt テキスト追加

全ての `<img>` および `<Image>` コンポーネントを検索する。

```bash
grep -rn "<img\|<Image" src/ --include="*.tsx" | grep -v "alt="
```

各画像に適切な `alt` テキストを追加する。

```tsx
// 変更前
<Image src="/hato.png" />

// 変更後
<Image src="/hato.png" alt="Hato ロゴ" />
```

装飾的な画像には空の `alt` を設定する:

```tsx
<Image src="/decoration.png" alt="" role="presentation" />
```

### Step 3: aria-live リージョンの追加

データ読み込み完了やエラー発生時にスクリーンリーダーに通知する。

```tsx
// グローバルな通知コンポーネント
export function LiveAnnouncer() {
  const [message, setMessage] = useState('');

  // Jotai アトムまたはコンテキストで通知メッセージを管理
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
      }}
    >
      {message}
    </div>
  );
}
```

### Step 4: フォーカス管理の改善

Chakra UI の `Modal`, `Drawer`, `Menu` は基本的にフォーカストラップを内蔵しているが、
カスタムモーダル等で手動管理している箇所がないか確認する。

```bash
grep -rn "useDisclosure\|isOpen\|onOpen\|onClose" src/ --include="*.tsx" | head -30
```

### Step 5: スキップリンクの追加（オプション）

メインコンテンツへのスキップリンクを追加する。

```tsx
// src/components/common/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      onFocus={(e) => {
        e.currentTarget.style.position = 'fixed';
        e.currentTarget.style.left = '8px';
        e.currentTarget.style.top = '8px';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.zIndex = '9999';
      }}
      onBlur={(e) => {
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.left = '-9999px';
      }}
    >
      メインコンテンツへスキップ
    </a>
  );
}
```

### Step 6: カラーコントラストの検証

テーマのセマンティックカラーを WCAG コントラストチェッカーで検証する。

特に確認すべき組み合わせ:
- `description` (gray.500) on `bg` (white): 4.6:1 → AA 合格
- `description` (gray.400) on `bg.900` (#121212): 要検証
- スクロールバー (`#aaa` on `#eee`): 要検証

## 確認事項

- [ ] キーボードのみで Dashboard のカード並べ替えが可能か確認
- [ ] スクリーンリーダー（VoiceOver）で主要ページを操作できるか確認
- [ ] 全ての画像に `alt` テキストが設定されているか確認
- [ ] `yarn build` が成功するか確認

## 関連ファイル

- `src/pages/Dashboard.tsx` — D&D アクセシビリティ
- `src/components/` — 画像 alt テキスト追加
- `src/theme.ts` — カラーコントラスト確認
