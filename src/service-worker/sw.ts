import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
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
  entries.push({ url: '/', revision: Math.random().toString() });

cleanupOutdatedCaches();

precacheAndRoute(entries);

const allowlist = import.meta.env.DEV ? [/^\/$/] : undefined;
const denylist = [/^\/api\//, /^\/sw.js$/];

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    allowlist,
    denylist,
  })
);

self.addEventListener('push', onPush);
self.addEventListener('notificationclick', onNotificationClick);
