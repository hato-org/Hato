import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { TbTrash } from 'react-icons/tb';
import { UserScheduleContext } from './context';
import { useUser } from '@/services/user';
import { overlayAtom } from '@/store/overlay';
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
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
  });
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeletemodalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const { data: user } = useUser();
  const [overlay, setOverlay] = useAtom(overlayAtom);

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

  const { data, isPending, error } = useUserSchedule(
    overlay.userScheduleEditor || '',
    {
      enabled:
        !!overlay.userScheduleEditor && overlay.userScheduleEditor !== 'new',
    },
  );
  const { mutate, isPending: mutatePending } = useUserScheduleMutation();

  useEffect(() => {
    if (data && overlay.userScheduleEditor !== 'new') setSchedule(data);
    else setSchedule(initialSchedule);
  }, [data, overlay.userScheduleEditor, initialSchedule]);

  return (
    <Modal
      isOpen={!!overlay.userScheduleEditor}
      onClose={() =>
        setOverlay((currVal) => ({ ...currVal, userScheduleEditor: false }))
      }
      size={{ base: 'full', md: '2xl' }}
    >
      <ModalOverlay />
      <ModalContent bg="panel" pb="env(safe-area-inset-bottom)">
        <UserScheduleContext.Provider
          value={useMemo(() => [schedule, setSchedule], [schedule])}
        >
          <ModalCloseButton top={4} right={4} />
          <ModalHeader>マイ時間割の編集</ModalHeader>
          <ModalBody px={4}>
            {overlay.userScheduleEditor !== 'new' && isPending ? (
              <Loading />
            ) : error ? (
              <Error error={error} />
            ) : (
              <VStack w="full" pb={8} spacing={6}>
                <UserScheduleMetaEditor
                  onVisibilityChange={(e) =>
                    setSchedule((val) => ({
                      ...val,
                      private: e.target.checked,
                    }))
                  }
                />
                {Object.entries(schedule.schedules).map(([key, val]) => (
                  <EditorTable
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
                      leftIcon={<Icon as={TbTrash} />}
                      onClick={onDeletemodalOpen}
                    >
                      時間割を削除する
                    </Button>
                    <UserScheduleDeleteDialog
                      id={schedule._id}
                      isOpen={isDeleteModalOpen}
                      onDelete={() => {
                        onDeleteModalClose();
                        setOverlay((currVal) => ({
                          ...currVal,
                          userScheduleEditor: false,
                        }));
                      }}
                      onCancel={onDeleteModalClose}
                    />
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              rounded="lg"
              colorScheme="blue"
              isDisabled={
                !schedule.title ||
                !schedule.owner ||
                !schedule.meta.grade ||
                !schedule.meta.class
              }
              isLoading={mutatePending}
              onClick={() => {
                mutate(schedule, {
                  onSuccess: () => {
                    setOverlay((currVal) => ({
                      ...currVal,
                      userScheduleEditor: false,
                    }));
                    toast({
                      title: '更新しました。',
                      status: 'success',
                    });
                  },
                  onError: (mutationErr) =>
                    toast({
                      title: '更新に失敗しました',
                      description: mutationErr.message,
                      status: 'error',
                    }),
                });
              }}
            >
              {overlay.userScheduleEditor === 'new' ? '追加' : '更新'}
            </Button>
          </ModalFooter>
        </UserScheduleContext.Provider>
      </ModalContent>
    </Modal>
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
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
  });
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { mutate } = useDeleteUserScheduleMutation();

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onCancel}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent bg="panel" p={2} rounded="xl">
        <AlertDialogHeader>時間割の削除</AlertDialogHeader>
        <AlertDialogBody>
          <Text textAlign="center" textStyle="title">
            本当に削除しますか？
            <br />
            この操作は取り消せません。
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <HStack w="full">
            <Button
              ref={cancelRef}
              w="full"
              variant="ghost"
              rounded="lg"
              onClick={onCancel}
            >
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
                      status: 'success',
                    });
                    onDelete();
                  },
                  onError: (deleteErr) => {
                    toast({
                      title: 'エラーが発生しました',
                      description: deleteErr.message,
                      status: 'error',
                    });
                  },
                })
              }
            >
              削除
            </Button>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
