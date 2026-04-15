# 16: global.css の修正

## 現状の問題

- `src/global.css` (L3) にタイポ: `-webkit-overlow-scrolling` → `-webkit-overflow-scrolling`
- L8-9 で `::-webkit-scrollbar` セレクタが重複している
- `*` ユニバーサルセレクタの使用（パフォーマンスへの軽微な影響）
- スクロールバーカラーがダークモード非対応（#15 と連動）

## 目標

- タイポと重複セレクタを修正する
- ダークモード対応は #15 で対応するため、ここでは基本的な修正のみ行う

## 実装手順

### Step 1: global.css を修正する

**変更前:**
```css
* {
  scrollbar-width: thin;
  overflow-scrolling: touch;
  -webkit-overlow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar,
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #eee;
}

::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 4px;
}
```

**変更後:**
```css
* {
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #eee;
}

::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 4px;
}
```

**変更点:**
1. `-webkit-overlow-scrolling` → `-webkit-overflow-scrolling`（タイポ修正）
2. `overflow-scrolling: touch;` を削除（非標準プロパティで `-webkit-` プレフィックス版で十分）
3. 重複する `::-webkit-scrollbar,\n::-webkit-scrollbar` → `::-webkit-scrollbar` に修正

## 確認事項

- [ ] スクロールバーの表示が変わっていないか確認（視覚的リグレッションなし）
- [ ] iOS Safari でのスクロール慣性が正常に動作するか確認
- [ ] `yarn build` が成功するか確認

## 関連ファイル

- `src/global.css` — 変更対象
