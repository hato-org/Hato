# 10: Service Worker ランタイムキャッシュの導入

## 現状の問題

- `src/service-worker/sw.ts` ではプリキャッシュ（静的アセット）のみを行っている
- API レスポンス (`/api/`) は denylist で除外されており、一切キャッシュされない
- オフライン時に API 依存のページが全て利用不能になる
- React Query の IndexedDB 永続化はあるが、Service Worker レベルのキャッシュがない

## 目標

- API レスポンスに `StaleWhileRevalidate` 戦略を適用する
- オフライン時でも直近のデータを表示可能にする
- キャッシュサイズとTTLを適切に制限する

## 実装手順

### Step 1: Workbox のキャッシュ戦略プラグインをインポートする

`src/service-worker/sw.ts` に以下を追加する。

```typescript
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
```

### Step 2: 必要なパッケージをインストールする

```bash
yarn add workbox-expiration workbox-cacheable-response
```

### Step 3: API キャッシュルートを追加する

`src/service-worker/sw.ts` の `registerRoute` の後に追加する。

```typescript
// API レスポンスのキャッシュ（StaleWhileRevalidate）
// まずキャッシュから返し、バックグラウンドで最新データを取得
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    url.pathname.startsWith('/api/') &&
    !url.pathname.startsWith('/api/auth/'), // 認証エンドポイントは除外
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // 成功レスポンスのみキャッシュ
      }),
      new ExpirationPlugin({
        maxEntries: 100,          // 最大100エントリ
        maxAgeSeconds: 60 * 60,   // 1時間で期限切れ
        purgeOnQuotaError: true,  // ストレージ不足時に自動パージ
      }),
    ],
  })
);

// 静的アセット（画像等）のキャッシュ（CacheFirst）
registerRoute(
  ({ request, url }) =>
    url.origin === self.location.origin &&
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        purgeOnQuotaError: true,
      }),
    ],
  })
);
```

### Step 4: denylist から API を除外する（条件付き）

現在の denylist 設定は NavigationRoute 用であり、API ルートの cache とは独立している。
NavigationRoute の denylist はそのまま維持する（API パスで `index.html` を返さないため）。

```typescript
// 既存: 変更不要
const denylist = [/^\/api\//, /^\/sw.js$/];
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    allowlist,
    denylist,
  })
);

// 新規: 上記の後に API キャッシュルートを追加（Step 3 の内容）
```

### Step 5: sw.ts の最終形

```typescript
import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { onNotificationClick, onPush } from './push';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('activate', (event) =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

const entries = self.__WB_MANIFEST;
if (import.meta.env.DEV)
  entries.push({ url: '/index.html', revision: Math.random().toString() });

cleanupOutdatedCaches();
precacheAndRoute(entries);

// Navigation: SPA フォールバック
const allowlist = import.meta.env.DEV ? [/^\/$/] : undefined;
const denylist = [/^\/api\//, /^\/sw.js$/];
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    allowlist,
    denylist,
  })
);

// API キャッシュ: StaleWhileRevalidate
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    url.pathname.startsWith('/api/') &&
    !url.pathname.startsWith('/api/auth/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// 画像キャッシュ: CacheFirst
registerRoute(
  ({ request, url }) =>
    url.origin === self.location.origin &&
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Push notifications
self.addEventListener('push', onPush);
self.addEventListener('notificationclick', onNotificationClick);
```

## 確認事項

- [ ] `yarn build` が成功するか確認
- [ ] Service Worker が正しく登録されるか確認（DevTools > Application > Service Workers）
- [ ] API レスポンスがキャッシュされているか確認（DevTools > Application > Cache Storage > api-cache）
- [ ] オフライン時にキャッシュ済みデータが表示されるか確認
- [ ] 認証エンドポイントがキャッシュされていないか確認
- [ ] キャッシュが1時間後に期限切れになるか確認

## 関連ファイル

- `src/service-worker/sw.ts` — 主な変更対象
- `package.json` — workbox 追加パッケージ
