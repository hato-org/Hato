import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import {
  NavigationRoute,
  registerRoute,
  setCatchHandler,
} from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { onNotificationClick, onPush } from './push';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('activate', (event) =>
  event.waitUntil(self.clients.claim()),
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
  }),
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
  }),
);

// 画像キャッシュ: CacheFirst
registerRoute(
  ({ request, url }) =>
    url.origin === self.location.origin && request.destination === 'image',
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
  }),
);

// オフラインフォールバック
setCatchHandler(async ({ event }) => {
  if (event instanceof FetchEvent && event.request.destination === 'document') {
    const cached = await caches.match('/offline.html');
    return cached || Response.error();
  }
  return Response.error();
});

// Push notifications
self.addEventListener('push', onPush);
self.addEventListener('notificationclick', onNotificationClick);
