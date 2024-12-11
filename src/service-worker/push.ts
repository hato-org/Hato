/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope;

export const onPush = (event: PushEvent) => {
  const { title, body, path /* timestamp */ } =
    event.data?.json() as PushPayload;

  return event.waitUntil(
    self.registration.showNotification(title, {
      dir: 'auto',
      badge: '/hato.png',
      icon: '/hato.png',
      body,
      data: {
        path,
      },
      // https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1725
      // timestamp,
    }),
  );
};

export const onNotificationClick = (event: NotificationEvent) => {
  event.waitUntil(
    (async () => {
      event.notification.close();
      await self.clients.openWindow(
        new URL(event.notification.data.path ?? '', self.location.origin),
      );
    })(),
  );
};
