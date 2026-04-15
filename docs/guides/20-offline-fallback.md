# 20: オフラインフォールバックページの作成

## 現状の問題

- オフライン時にプリキャッシュされていないページにアクセスすると、ブラウザのデフォルトエラー画面が表示される
- PWA をインストールしたユーザーは「オフラインでも使える」と期待するが、実際にはエラーになるケースがある
- API レスポンスがキャッシュされていない場合の UI フィードバックがない

## 目標

- アプリのデザインに合った親切なオフラインページを作成する
- Service Worker でナビゲーション失敗時にフォールバックページを返す

## 実装手順

### Step 1: オフラインページの HTML を作成する

`public/offline.html` を新規作成する。
Service Worker から直接提供するため、スタンドアロンの HTML ファイルとする。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>オフライン - Hato</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, Inter, "Noto Sans JP Variable", sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100dvh;
      padding: 2rem;
      background: #fff;
      color: #333;
    }
    @media (prefers-color-scheme: dark) {
      body { background: #121212; color: #e0e0e0; }
      .card { background: #202020; border-color: #323232; }
      .retry-btn { background: #3182ce; }
      .retry-btn:hover { background: #2b6cb0; }
    }
    .container { text-align: center; max-width: 400px; }
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    @media (prefers-color-scheme: dark) {
      p { color: #999; }
    }
    .retry-btn {
      display: inline-block;
      padding: 0.625rem 1.5rem;
      background: #3182ce;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .retry-btn:hover { background: #2b6cb0; }
    .retry-btn:active { background: #2c5282; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>オフラインです</h1>
    <p>
      インターネットに接続されていません。<br>
      接続を確認して、もう一度お試しください。
    </p>
    <button class="retry-btn" onclick="window.location.reload()">
      再試行
    </button>
  </div>
</body>
</html>
```

### Step 2: Service Worker にオフラインフォールバックを追加する

`src/service-worker/sw.ts` に以下を追加する。

```typescript
import { setCatchHandler } from 'workbox-routing';

// オフラインフォールバック: ナビゲーションリクエストが全て失敗した場合
setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    // プリキャッシュからオフラインページを返す
    return caches.match('/offline.html') || Response.error();
  }
  return Response.error();
});
```

### Step 3: オフラインページをプリキャッシュに含める

`vite.config.ts` で `offline.html` がプリキャッシュされるようにする。

`globPatterns` に `.html` が含まれていれば自動的に対象になる。
含まれていない場合は明示的に追加する:

```typescript
globPatterns: [
  '**/*.{js,css,html,woff,woff2}',
  'icon-*.png',
  'offline.html',  // 明示的に追加（必要な場合）
],
```

### Step 4: 必要なパッケージの確認

`setCatchHandler` は `workbox-routing` に含まれている。既にインストール済みなので追加不要。

### Step 5: オンライン復帰時の自動リロード（オプション）

オフラインページに、オンライン復帰を検知して自動リロードするスクリプトを追加する。

```html
<script>
  window.addEventListener('online', () => {
    window.location.reload();
  });
</script>
```

## 確認事項

- [ ] DevTools > Network > Offline にチェックを入れてページ遷移するとオフラインページが表示されるか確認
- [ ] オフラインページのライトモード・ダークモードが正しく表示されるか確認
- [ ] 「再試行」ボタンが動作するか確認
- [ ] オンライン復帰後にページが自動リロードされるか確認（オプション実装時）
- [ ] `yarn build` が成功するか確認

## 関連ファイル

- `public/offline.html` — 新規作成
- `src/service-worker/sw.ts` — フォールバックハンドラ追加
- `vite.config.ts` — プリキャッシュ設定の確認
