# 15: テーマのハードコード値の解消

## 現状の問題

- `src/theme.ts` のセマンティックトークンにハードコードされた色値がある
  - `panel._dark`: `'#202020'`（L49） — テーマパレットの `bg.800` (`#323232`) に近いが一致しない
  - `bgAlpha._dark`: `'#121212CC'`（L46） — `bg.900` にアルファを付加したもの
- テーマカラーを変更した場合、これらの値が追従しない

## 目標

- ハードコード色値をテーマトークンまたはカスタムパレット値に置き換える
- テーマの一貫性を確保する

## 実装手順

### Step 1: カスタムカラーパレットに必要な色を追加する

`src/theme.ts` の `colors.bg` に `panel` 用の色を追加する。

```typescript
const colors = {
  bg: {
    '50': '#f7f7f7',
    '100': '#eeeeee',
    '200': '#e2e2e2',
    '300': '#d0d0d0',
    '400': '#ababab',
    '500': '#8a8a8a',
    '600': '#636363',
    '700': '#505050',
    '750': '#202020',  // panel 用（新規追加）
    '800': '#323232',
    '900': '#121212',
  },
};
```

### Step 2: セマンティックトークンを更新する

**変更前:**
```typescript
panel: {
  default: 'white',
  _dark: '#202020',
},
bgAlpha: {
  default: 'whiteAlpha.800',
  _dark: '#121212CC',
},
```

**変更後:**
```typescript
panel: {
  default: 'white',
  _dark: 'bg.750',
},
bgAlpha: {
  default: 'whiteAlpha.800',
  _dark: 'blackAlpha.800', // または Chakra UI のアルファトークンを使用
},
```

**注意:** Chakra UI のセマンティックトークンではカスタムアルファ値を直接指定できない場合がある。
`bgAlpha` についてはCSS カスタムプロパティを使う方法も検討する。

```typescript
// 代替案: CSS変数を使用
bgAlpha: {
  default: 'whiteAlpha.800',
  _dark: 'rgba(18, 18, 18, 0.8)', // bg.900 のアルファ版
},
```

`#121212CC` は `rgba(18, 18, 18, 0.8)` と同等なので、この場合は機能的に同じだが、
パレットカラーとの関連が明示的になる。

### Step 3: global.css のスクロールバーカラーをテーマ対応にする

CSS カスタムプロパティを使ってダークモードに対応する。

**変更前:**
```css
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
::-webkit-scrollbar-track {
  background: var(--chakra-colors-bg-100);
}

::-webkit-scrollbar-thumb {
  background: var(--chakra-colors-bg-400);
  border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: var(--chakra-colors-bg-800);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--chakra-colors-bg-600);
  }
}
```

## 確認事項

- [ ] ライトモードとダークモードの両方でパネル背景色が適切か確認
- [ ] bgAlpha がヘッダーのグラスモーフィズム効果で正しく表示されるか確認
- [ ] スクロールバーがダークモードで視認できるか確認
- [ ] `yarn build` が成功するか確認

## 関連ファイル

- `src/theme.ts` — セマンティックトークンの更新
- `src/global.css` — スクロールバーのテーマ対応
