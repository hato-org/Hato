import { Suspense, useCallback, useMemo } from 'react';
import {
  Alert,
  Box,
  Collapsible,
  HStack,
  Icon,
  List,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { Switch } from '@/components/ui/switch';
import { toaster } from '@/components/ui/toaster';
import { useAtomValue } from 'jotai';
import { TbExclamationCircle } from 'react-icons/tb';
import { MotionCenter } from '@/components/motion';
import SettingCategory from './Category';
import SettingButton from './Button';
import { usePushSubscribe, usePushUnsubscribe } from '@/services/push';
import Loading from '@/components/common/Loading';
import {
  pushPermissionSelector,
  pushSubscriptionSelector,
} from '@/store/serviceWorker';
import { useSettings, useSettingsMutation } from '@/services/settings';

export default function Notification() {
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1500, ...options });

  const pushSubscription = useAtomValue(pushSubscriptionSelector);
  const pushPermission = useAtomValue(pushPermissionSelector);

  const { mutate: subscribe, isPending: subscribePending } = usePushSubscribe();
  const { mutate: unsubscribe, isPending: unsubscribePending } =
    usePushUnsubscribe();

  const isPushAvailable = !!pushPermission && pushPermission !== 'denied';

  return (
    <MotionCenter
      w="100%"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{
        duration: 0.2,
        type: 'spring',
        damping: 25,
        stiffness: 180,
      }}
      layout
    >
      <SettingCategory title="通知">
        <VStack gap={4} align="flex-start" w="100%">
          <SettingButton
            {...{
              label: 'プッシュ通知',
              description: 'プッシュ通知を有効にするか。',
              children: (
                <HStack gap={4}>
                  {(subscribePending || unsubscribePending) && (
                    <Spinner size="sm" color="blue.400" />
                  )}
                  <Switch
                    size="lg"
                    disabled={
                      subscribePending || unsubscribePending || !isPushAvailable
                    }
                    checked={!!pushSubscription}
                    onCheckedChange={() =>
                      pushSubscription
                        ? unsubscribe(undefined, {
                            onError: () => {
                              toast({
                                title: '無効化に失敗しました',
                                type: 'error',
                              });
                            },
                          })
                        : subscribe(undefined, {
                            onError: () => {
                              toast({
                                title: '有効化に失敗しました',
                                description:
                                  'システムの通知設定を確認してください',
                                type: 'error',
                              });
                            },
                          })
                    }
                  />
                </HStack>
              ),
            }}
          />
          <Box w="full">
            <Collapsible.Root open={!isPushAvailable}><Collapsible.Content>
              <Alert.Root status="warning" rounded="xl">
                <VStack w="full" align="flex-start">
                  <HStack>
                    <Alert.Indicator />
                    <Alert.Title>プッシュ通知を有効にできません</Alert.Title>
                  </HStack>
                  <Alert.Description textStyle="description" fontWeight="bold">
                    以下をお試しください
                  </Alert.Description>
                  <List.Root gap={2}>
                    {/iPhone OS ([1-9]|1[1-6])_[0-3]/.test(
                      navigator.userAgent,
                    ) && (
                      <List.Item textStyle="title">
                        iOSをアップデートする（16.4+）
                      </List.Item>
                    )}
                    <List.Item textStyle="title">ホーム画面に追加する</List.Item>
                    <List.Item textStyle="title">
                      OSの設定で通知を許可する
                    </List.Item>
                  </List.Root>
                </VStack>
              </Alert.Root>
            </Collapsible.Content></Collapsible.Root>
          </Box>
          <Suspense fallback={<Loading />}>
            <Box w="full">
              <Collapsible.Root open={!!pushSubscription}><Collapsible.Content>
                <NotificationDetail />
              </Collapsible.Content></Collapsible.Root>
            </Box>
          </Suspense>
        </VStack>
      </SettingCategory>
    </MotionCenter>
  );
}

function NotificationDetail() {
  const list = useMemo<{ id: WebPushServiceId; label: string }[]>(
    () => [
      {
        id: 'timetable',
        label: '時間割 / 日課',
      },
      {
        id: 'event',
        label: '年間行事予定',
      },
      {
        id: 'hatoboard',
        label: 'はとボード',
      },
      {
        id: 'transit',
        label: '交通情報',
      },
      {
        id: 'classmatch',
        label: 'クラスマッチ',
      },
    ],
    [],
  );

  return (
    <VStack w="full">
      {list.map((item) => (
        <SettingButton key={item.id} {...item}>
          <NotifySettingSwitch id={item.id} />
        </SettingButton>
      ))}
    </VStack>
  );
}

function NotifySettingSwitch({ id }: { id: WebPushServiceId }) {
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1500, ...options });
  const { data: settings, error } = useSettings();
  const { mutate, isPending } = useSettingsMutation();

  const notifySettingReducer = useCallback(
    (serviceId: WebPushServiceId, type: 'add' | 'remove') => ({
      ...settings,
      notification: {
        push:
          type === 'add'
            ? [...(settings?.notification.push ?? []), serviceId]
            : (settings?.notification.push.filter((i) => i !== serviceId) ??
              []),
      },
    }),
    [settings],
  );

  return (
    <HStack gap={4}>
      {isPending && <Spinner color="blue.400" size="xs" />}
      {error && (
        <Icon as={TbExclamationCircle} color="yellow.400" boxSize={5} />
      )}
      <Switch
        disabled={isPending || !!error}
        checked={settings?.notification.push.includes(id) ?? false}
        onCheckedChange={(e) =>
          mutate(
            notifySettingReducer(id, e.checked ? 'add' : 'remove'),
            {
              onError: (err) => {
                toast({
                  title: '更新に失敗しました',
                  description: err.message,
                  type: 'error',
                });
              },
            },
          )
        }
      />
    </HStack>
  );
}
