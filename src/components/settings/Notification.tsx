import { Suspense, useCallback, useMemo } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Collapse,
  HStack,
  Icon,
  ListItem,
  Spinner,
  Switch,
  UnorderedList,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { TbExclamationCircle } from 'react-icons/tb';
import { MotionCenter } from '../motion';
import SettingCategory from './Category';
import SettingButton from './Button';
import { usePushSubscribe, usePushUnsubscribe } from '@/services/push';
import Loading from '../common/Loading';
import {
  pushPermissionSelector,
  pushSubscriptionSelector,
} from '@/store/serviceWorker';
import { useSettings, useSettingsMutation } from '@/services/settings';

export default function Notification() {
  const toast = useToast({ position: 'top-right', duration: 1500 });

  const pushSubscription = useAtomValue(pushSubscriptionSelector);
  const pushPermission = useAtomValue(pushPermissionSelector);

  const { mutate: subscribe, isPending: subscribePending } = usePushSubscribe();
  const { mutate: unsubscribe, isPending: unsubscribePending } =
    usePushUnsubscribe();

  const isPushAvailable = !!pushPermission && pushPermission !== 'denied';

  return (
    <MotionCenter
      w="100%"
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }}
      layout
    >
      <SettingCategory title="通知">
        <VStack spacing={4} align="flex-start" w="100%">
          <SettingButton
            {...{
              label: 'プッシュ通知',
              description: 'プッシュ通知を有効にするか。',
              children: (
                <HStack spacing={4}>
                  {(subscribePending || unsubscribePending) && (
                    <Spinner size="sm" color="blue.400" />
                  )}
                  <Switch
                    size="lg"
                    isDisabled={
                      subscribePending || unsubscribePending || !isPushAvailable
                    }
                    isChecked={!!pushSubscription}
                    onChange={() =>
                      pushSubscription
                        ? unsubscribe(undefined, {
                            onError: () => {
                              toast({
                                title: '無効化に失敗しました',
                                status: 'error',
                              });
                            },
                          })
                        : subscribe(undefined, {
                            onError: () => {
                              toast({
                                title: '有効化に失敗しました',
                                description:
                                  'システムの通知設定を確認してください',
                                status: 'error',
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
            <Collapse in={!isPushAvailable}>
              <Alert status="warning" rounded="xl">
                <VStack w="full" align="flex-start">
                  <HStack>
                    <AlertIcon />
                    <AlertTitle>プッシュ通知を有効にできません</AlertTitle>
                  </HStack>
                  <AlertDescription textStyle="description" fontWeight="bold">
                    以下をお試しください
                  </AlertDescription>
                  <UnorderedList spacing={2}>
                    {/iPhone OS ([1-9]|1[1-6])_[0-3]/.test(
                      navigator.userAgent,
                    ) && (
                      <ListItem textStyle="title">
                        iOSをアップデートする（16.4+）
                      </ListItem>
                    )}
                    <ListItem textStyle="title">ホーム画面に追加する</ListItem>
                    <ListItem textStyle="title">
                      OSの設定で通知を許可する
                    </ListItem>
                  </UnorderedList>
                </VStack>
              </Alert>
            </Collapse>
          </Box>
          <Suspense fallback={<Loading />}>
            <Box w="full">
              <Collapse in={!!pushSubscription}>
                <NotificationDetail />
              </Collapse>
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
  const toast = useToast({ position: 'top-right', duration: 1500 });
  const { data: settings, error } = useSettings();
  const { mutate, isPending } = useSettingsMutation();

  const notifySettingReducer = useCallback(
    (serviceId: WebPushServiceId, type: 'add' | 'remove') => ({
      ...settings,
      notification: {
        push:
          type === 'add'
            ? [...(settings?.notification.push ?? []), serviceId]
            : settings?.notification.push.filter((i) => i !== serviceId) ?? [],
      },
    }),
    [settings],
  );

  return (
    <HStack spacing={4}>
      {isPending && <Spinner color="blue.400" size="xs" />}
      {error && (
        <Icon as={TbExclamationCircle} color="yellow.400" boxSize={5} />
      )}
      <Switch
        isDisabled={isPending || !!error}
        isChecked={settings?.notification.push.includes(id) ?? false}
        onChange={(e) =>
          mutate(
            notifySettingReducer(id, e.target.checked ? 'add' : 'remove'),
            {
              onError: (err) => {
                toast({
                  title: '更新に失敗しました',
                  description: err.message,
                  status: 'error',
                });
              },
            },
          )
        }
      />
    </HStack>
  );
}
