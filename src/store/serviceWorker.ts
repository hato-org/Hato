import { atom } from 'jotai';
import { atomWithRefresh } from '@/utils/atoms';

export const serviceWorkerSelector = atom(async () =>
  navigator.serviceWorker.getRegistration(),
);

export const pushSubscriptionSelector = atomWithRefresh(
  async (get) =>
    (await get(serviceWorkerSelector))?.pushManager?.getSubscription(),
);

export const pushPermissionSelector = atom(
  async (get) =>
    (await get(serviceWorkerSelector))?.pushManager?.permissionState({
      userVisibleOnly: true,
    }),
);
