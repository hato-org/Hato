import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import {
  pushSubscriptionSelector,
  serviceWorkerSelector,
} from '@/store/serviceWorker';
import { useClient } from '@/modules/client';

export const usePushSubscribe = () => {
  const { client } = useClient();
  const toast = useToast({ position: 'top-right', duration: 1500 });
  const serviceWorker = useRecoilValue(serviceWorkerSelector);
  const refreshPushSubscription = useRecoilRefresher_UNSTABLE(
    pushSubscriptionSelector
  );

  return useMutation(
    async () => {
      const vapidKey = (await client.get<string>('/webpush/key')).data;
      const subscription = await serviceWorker?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      if (subscription)
        await client.post('/webpush/subscribe', subscription.toJSON());
    },
    {
      onSettled: refreshPushSubscription,
      onError: () => {
        toast({
          title: '有効化に失敗しました',
          description: 'システムの通知設定を確認してください',
          status: 'error',
        });
      },
    }
  );
};

export const usePushUnsubscribe = () => {
  const { client } = useClient();
  const toast = useToast({ position: 'top-right', duration: 1500 });
  const serviceWorker = useRecoilValue(serviceWorkerSelector);
  const refreshPushSubscription = useRecoilRefresher_UNSTABLE(
    pushSubscriptionSelector
  );

  return useMutation(
    async () => {
      const subscription = await serviceWorker?.pushManager.getSubscription();
      if (subscription) {
        await client.post('/webpush/unsubscribe', subscription.toJSON());
        await subscription.unsubscribe();
      }
    },
    {
      onSettled: refreshPushSubscription,
      onError: () => {
        toast({
          title: '無効化に失敗しました',
          status: 'error',
        });
      },
    }
  );
};
