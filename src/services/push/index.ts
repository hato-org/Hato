import { useMutation } from '@tanstack/react-query';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  pushSubscriptionSelector,
  serviceWorkerSelector,
} from '@/store/serviceWorker';
import { useClient } from '@/modules/client';

export const usePushSubscribe = () => {
  const { client } = useClient();
  const serviceWorker = useAtomValue(serviceWorkerSelector);
  const refreshPushSubscription = useSetAtom(pushSubscriptionSelector);

  return useMutation({
    mutationFn: async () => {
      const vapidKey = (await client.get<string>('/webpush/key')).data;
      const subscription = await serviceWorker?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      if (subscription)
        await client.post('/webpush/subscribe', subscription.toJSON());
    },
    onSettled: refreshPushSubscription,
  });
};

export const usePushUnsubscribe = () => {
  const { client } = useClient();
  const serviceWorker = useAtomValue(serviceWorkerSelector);
  const refreshPushSubscription = useSetAtom(pushSubscriptionSelector);

  return useMutation({
    mutationFn: async () => {
      const subscription = await serviceWorker?.pushManager.getSubscription();
      if (subscription) {
        await client.post('/webpush/unsubscribe', subscription.toJSON());
        await subscription.unsubscribe();
      }
    },
    onSettled: refreshPushSubscription,
  });
};
