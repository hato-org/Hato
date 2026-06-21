import { useEffect, useMemo, useState } from 'react';
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import {
  Button,
  HStack,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { useAtom } from 'jotai';
import { TbTrash } from 'react-icons/tb';
import { UserScheduleContext } from './context';
import { useUser } from '@/services/user';
import { userScheduleEditorAtom } from '@/store/overlay';
import {
  useDeleteUserScheduleMutation,
  useUserSchedule,
  useUserScheduleMutation,
} from '@/services/timetable';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';
import { UserScheduleMetaEditor } from './MetaEditor';
import { EditorTable } from './Table';

export default function UserScheduleEditor() {
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 3000, ...options });
  const {
    open: isDeleteModalOpen,
    onOpen: onDeletemodalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const { data: user } = useUser();
  const [userScheduleEditor, setUserScheduleEditor] = useAtom(
    userScheduleEditorAtom,
  );

  const initialSchedule = useMemo(
    () => ({
      owner: user._id,
      title: '',
      private: true,
      schedules: {
        A: [[], [], [], [], [], [], []],
        B: [[], [], [], [], [], [], []],
      },
      meta: {
        type: user.type,
        grade: user.grade,
        class: user.class,
        course: user.course,
      },
    }),
    [user],
  );

  const [schedule, setSchedule] = useState<UserSchedule>(initialSchedule);

  const { data, isLoading, isPending, error } = useUserSchedule(
    userScheduleEditor || '',
    {
      enabled: !!userScheduleEditor && userScheduleEditor !== 'new',
    },
  );
  const { mutate, isPending: mutatePending } = useUserScheduleMutation();

  useEffect(() => {
    if (data && userScheduleEditor !== 'new') setSchedule(data);
    else setSchedule(initialSchedule);
  }, [isLoading, userScheduleEditor]);

  return (
    <DialogRoot
      open={!!userScheduleEditor}
      onOpenChange={(e) => !e.open && (() => setUserScheduleEditor(false))()}
      size={{ base: 'full', md: 'xl' }}
    >
      <DialogContent bg="panel" pb="env(safe-area-inset-bottom)">
        <UserScheduleContext.Provider
          value={useMemo(() => [schedule, setSchedule], [schedule])}
        >
          <DialogCloseTrigger top={4} right={4} />
          <DialogHeader>マイ時間割の編集</DialogHeader>
          <DialogBody px={4}>
            {userScheduleEditor !== 'new' && isPending ? (
              <Loading />
            ) : error ? (
              <Error error={error} />
            ) : (
              <VStack w="full" pb={8} gap={6}>
                <UserScheduleMetaEditor
                  onVisibilityChange={(e) =>
                    setSchedule((val) => ({
                      ...val,
                      private: e.checked,
                    }))
                  }
                />
                {Object.entries(schedule.schedules).map(([key, val]) => (
                  <EditorTable
                    key={key}
                    week={key as Week}
                    schedules={val}
                    meta={schedule.meta}
                    isPrivate={schedule.private}
                  />
                ))}
                {schedule._id && (
                  <>
                    <Button
                      w="full"
                      rounded="lg"
                      colorScheme="red"
                      variant="outline"
                      onClick={onDeletemodalOpen}
                    >
                      {<Icon as={TbTrash} />}
                      時間割を削除する
                    </Button>
                    <UserScheduleDeleteDialog
                      id={schedule._id}
                      isOpen={isDeleteModalOpen}
                      onDelete={() => {
                        onDeleteModalClose();
                        setUserScheduleEditor(false);
                      }}
                      onCancel={onDeleteModalClose}
                    />
                  </>
                )}
              </VStack>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              w="full"
              rounded="lg"
              colorScheme="blue"
              disabled={
                !schedule.title ||
                !schedule.owner ||
                !schedule.meta.grade ||
                !schedule.meta.class
              }
              loading={mutatePending}
              onClick={() => {
                mutate(schedule, {
                  onSuccess: () => {
                    setUserScheduleEditor(false);
                    toast({
                      title: '更新しました。',
                      type: 'success',
                    });
                  },
                  onError: (mutationErr) =>
                    toast({
                      title: '更新に失敗しました',
                      description: mutationErr.message,
                      type: 'error',
                    }),
                });
              }}
            >
              {userScheduleEditor === 'new' ? '追加' : '更新'}
            </Button>
          </DialogFooter>
        </UserScheduleContext.Provider>
      </DialogContent>
    </DialogRoot>
  );
}

function UserScheduleDeleteDialog({
  id,
  isOpen,
  onDelete,
  onCancel,
}: {
  id: string;
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 3000, ...options });
  const { mutate } = useDeleteUserScheduleMutation();

  return (
    <DialogRoot
      role="alertdialog"
      open={isOpen}
      onOpenChange={(e) => !e.open && onCancel()}
      placement="center"
    >
      <DialogBackdrop />
      <DialogContent bg="panel" p={2} rounded="xl">
        <DialogHeader>時間割の削除</DialogHeader>
        <DialogBody>
          <Text textAlign="center" textStyle="title">
            本当に削除しますか？
            <br />
            この操作は取り消せません。
          </Text>
        </DialogBody>
        <DialogFooter>
          <HStack w="full">
            <Button w="full" variant="ghost" rounded="lg" onClick={onCancel}>
              キャンセル
            </Button>
            <Button
              w="full"
              rounded="lg"
              colorScheme="red"
              onClick={() =>
                mutate(id, {
                  onSuccess: () => {
                    toast({
                      title: '削除しました。',
                      type: 'success',
                    });
                    onDelete();
                  },
                  onError: (deleteErr) => {
                    toast({
                      title: 'エラーが発生しました',
                      description: deleteErr.message,
                      type: 'error',
                    });
                  },
                })
              }
            >
              削除
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
