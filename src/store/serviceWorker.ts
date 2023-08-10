import { selector } from 'recoil';

export const serviceWorkerSelector = selector({
  key: 'hato.serviceWorker',
  get: async () => navigator.serviceWorker.getRegistration(),
});

export const pushSubscriptionSelector = selector({
  key: 'hato.serviceWorker.pushSubscription',
  get: async ({ get }) =>
    get(serviceWorkerSelector)?.pushManager?.getSubscription(),
});

export const pushPermissionSelector = selector({
  key: 'hato.serviceWorker.pushPermission',
  get: async ({ get }) =>
    get(serviceWorkerSelector)?.pushManager?.permissionState({
      userVisibleOnly: true,
    }),
});
