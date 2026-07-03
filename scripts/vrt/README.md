# Visual Regression Testing (v2 ↔ v3 比較ハーネス)

Chakra v2 (master) と v3 (移行ブランチ) のスクリーンショットをピクセル比較する。

## 使い方

```bash
# 1. master を worktree として展開し、両バージョンを起動
git worktree add /tmp/hato-v2 master
(cd /tmp/hato-v2 && yarn install && npx vite --port 3001 --strictPort) &
npx vite --port 3000 --strictPort &

# 2. 依存を用意して実行 (このディレクトリで)
npm i playwright@1.61 pixelmatch pngjs && npx playwright install chromium
node capture.mjs   # ./shots に 16ルート × light/dark × desktop/mobile × 2バージョン
node compare.mjs   # 差分率ランキング + ./diffs に差分画像
```

- 認証は偽 JWT + ダミー user を localStorage に seed して RequireLogin を通過
- 外部リクエストは全て abort し、両者を同じ loading/error 状態に固定
- アニメーション無効化・時刻固定でノイズを除去
