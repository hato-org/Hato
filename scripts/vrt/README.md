# Visual Regression Testing (v2 ↔ v3 比較ハーネス)

Chakra v2 (dev) と v3 (移行ブランチ) のスクリーンショットをピクセル比較する。

## 使い方

```bash
# 1. master を worktree として展開し、両バージョンを起動
# ローカルの master は古い (2024) ため、移行元である origin/dev を基準にする
git worktree add --detach /tmp/hato-v2 origin/dev
(cd /tmp/hato-v2 && yarn install && npx vite --port 3001 --strictPort) &
npx vite --port 3000 --strictPort &

# 2. 依存を用意して実行 (このディレクトリで)
npm i playwright@1.61 pixelmatch pngjs && npx playwright install chromium
node capture.mjs   # ./shots に 16ルート × light/dark × desktop/mobile × 2バージョン
node compare.mjs   # 差分率ランキング + ./diffs に差分画像
```

- 認証は偽 JWT + ダミー user を localStorage に seed して RequireLogin を通過
- 外部リクエストと /api/ (vite proxy) は全て abort し、両者を同じ loading/error 状態に固定
  (v2 は ky の afterResponse が旧 API のため 401 処理が動かず、v3 だけ偽 JWT でログアウトされるのを防ぐ)
- アニメーション無効化・時刻固定でノイズを除去
