# 19: プリキャッシュサイズの最適化

## 現状の問題

- `vite.config.ts` の `globPatterns` が `['**/*.{js,css,html,ico,png,gif,svg,woff,woff2}']` で全静的アセットを対象としている
- チュートリアル画像、クラスマッチの過去年度画像など、頻繁にアクセスされないアセットもプリキャッシュされている
- 推定プリキャッシュサイズ: 約15MB（削減目標: 約10MB）

## 目標

- 不要なアセットをプリキャッシュから除外する
- アプリ起動に必要な最小限のアセットのみをプリキャッシュする
- 除外したアセットはランタイムキャッシュ（#10）で対応する

## 実装手順

### Step 1: 現在のプリキャッシュ対象を確認する

```bash
# ビルドして出力されるアセットを確認
yarn build
find dist/ -type f | sort
du -sh dist/

# 画像ファイルのサイズを確認
find dist/ -name "*.png" -o -name "*.gif" -o -name "*.svg" | xargs ls -lhS
```

### Step 2: 除外対象を特定する

`public/` ディレクトリの内容を確認し、プリキャッシュ不要なアセットを特定する。

```bash
find public/ -type f | sort
du -sh public/*
```

**除外候補:**
- チュートリアル用の画像（ステップ説明画像等）
- クラスマッチの過去年度別画像
- 大きなスクリーンショット・説明画像
- `hato.png`（224KB、通知アイコン用だがプリキャッシュ不要）

### Step 3: vite.config.ts を修正する

```typescript
VitePWA({
  // ...
  injectManifest: {
    globPatterns: [
      '**/*.{js,css,html,woff,woff2}',   // コード・スタイル・フォントは必須
      'icon-*.png',                        // PWA アイコンのみ
      'favicon.ico',
    ],
    // 以下のパターンに一致するファイルを除外
    globIgnores: [
      '**/ical/**',              // チュートリアル画像
      '**/AddToHomeScreen/**',   // ホーム画面追加説明画像
      '**/classmatch/**',        // クラスマッチ画像（ランタイムキャッシュで対応）
      'hato.png',                // 通知アイコン（ランタイムキャッシュで対応）
    ],
  },
})
```

**注意:** `globIgnores` のパターンはビルド出力（`dist/`）に基づく。`public/` のサブディレクトリ構造を確認してから正確なパターンを決定すること。

### Step 4: ビルドして効果を確認する

```bash
yarn build
# プリキャッシュマニフェストのサイズを確認
cat dist/sw.js | grep -o "url:" | wc -l
```

### Step 5: ランタイムキャッシュとの連携確認

#10 の Service Worker ランタイムキャッシュが導入済みであれば、除外した画像アセットは `CacheFirst` 戦略でランタイムキャッシュされる。未導入の場合は #10 を先に実施すること。

## 確認事項

- [ ] `yarn build` が成功するか確認
- [ ] プリキャッシュマニフェストのエントリ数・サイズが減少したか確認
- [ ] PWA のインストール・初回起動が高速化したか確認
- [ ] 除外したアセットがランタイムキャッシュで正しくキャッシュされるか確認
- [ ] オフライン時にチュートリアル画像等が表示されるか確認（初回オンラインアクセス後）

## 関連ファイル

- `vite.config.ts` — globPatterns / globIgnores の変更
- `public/` — 除外対象アセットの確認
- `src/service-worker/sw.ts` — ランタイムキャッシュ（#10 と連動）
