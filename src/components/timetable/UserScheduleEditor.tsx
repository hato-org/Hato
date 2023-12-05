import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Spacer,
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import {
  TbChevronDown,
  TbExclamationCircle,
  TbPlus,
  TbTrash,
} from 'react-icons/tb';
import { overlayAtom } from '@/store/overlay';
import {
  useUserSchedule,
  useDeleteUserScheduleMutation,
  useUserScheduleMutation,
  useUserSubject,
} from '@/services/timetable';
import Loading from '../common/Loading';
import Error from '../cards/Error';
import { useUser } from '@/services/user';
import AddUserSubjectDrawer from './AddUserSubjectDrawer';
import UserSubjectEditor from './UserSubjectEditor';
import { useClassList, useCourseList, useGradeList } from '@/services/info';
import { days } from '@/utils/date';

export default function UserScheduleEditor() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast({
    position: 'top-right',
    duration: 1000,
  });
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

  const { data, isLoading, error } = useUserSchedule(
    overlay.userScheduleEditor || '',
    {
      enabled:
        !!overlay.userScheduleEditor && overlay.userScheduleEditor !== 'new',
    },
  );

  const { mutate, isPending: mutatePending } = useUserScheduleMutation();
  const { mutate: deleteSchedule } = useDeleteUserScheduleMutation();

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
      size="full"
    >
      <ModalOverlay />
      <ModalContent bg="panel" pb="env(safe-area-inset-bottom)">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>マイ時間割の編集</ModalHeader>
        <ModalBody px={4}>
          {/* eslint-disable no-nested-ternary */}
          {overlay.userScheduleEditor !== 'new' && isLoading ? (
            <Loading />
          ) : error ? (
            <Error error={error} />
          ) : (
            <VStack w="full" pb={8} spacing={6}>
              <EditorProperties
                {...schedule}
                onVisibilityChange={(e) =>
                  setSchedule((val) => ({ ...val, private: e.target.checked }))
                }
                setter={setSchedule}
              />
              {Object.entries(schedule.schedules).map(([key, val]) => (
                <EditorTable
                  week={key as Week}
                  schedules={val}
                  meta={schedule.meta}
                  isPrivate={schedule.private}
                  setter={setSchedule}
                />
              ))}
              {schedule._id && (
                <Button
                  w="full"
                  rounded="lg"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<Icon as={TbTrash} />}
                  onClick={onOpen}
                >
                  時間割を削除する
                </Button>
              )}
              <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={isOpen}
                onClose={onClose}
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
                        onClick={onClose}
                      >
                        キャンセル
                      </Button>
                      <Button
                        w="full"
                        rounded="lg"
                        colorScheme="red"
                        onClick={() =>
                          deleteSchedule(schedule._id, {
                            onSuccess: () => {
                              toast({
                                title: '削除しました。',
                                status: 'success',
                              });
                              onClose();
                              setOverlay((val) => ({
                                ...val,
                                userScheduleEditor: false,
                              }));
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
            </VStack>
          )}
          {/* eslint-enable no-nested-ternary */}
        </ModalBody>
        <ModalFooter
          w="full"
          bg="panel"
          borderTop="1px solid"
          borderColor="border"
          pos="sticky"
          bottom={0}
        >
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
      </ModalContent>
    </Modal>
  );
}

const EditorProperties = React.memo(
  ({
    _id,
    title,
    description,
    meta,
    private: isPrivate,
    onVisibilityChange,
    setter,
  }: UserSchedule & {
    onVisibilityChange: React.ChangeEventHandler<HTMLInputElement>;
    setter: React.Dispatch<React.SetStateAction<UserSchedule>>;
  }) => {
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
    const { data: gradeList } = useGradeList();
    const { data: classList } = useClassList({
      type: meta.type,
      grade: meta.grade,
    });
    const { data: courseList } = useCourseList({
      type: meta.type,
      grade: meta.grade,
    });

    return (
      <VStack
        w="full"
        rounded="xl"
        border="1px solid"
        borderColor="border"
        overflow="hidden"
        spacing={0}
      >
        <HStack w="full" p={4} onClick={onToggle} layerStyle="button">
          <Text textStyle="title" fontSize="xl">
            時間割情報
          </Text>
          <Spacer />
          <Icon
            as={TbChevronDown}
            transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            transition="all .2s ease"
          />
        </HStack>
        <Box w="full">
          <Collapse in={isOpen}>
            <VStack p={4} spacing={4}>
              <Input
                size="lg"
                textStyle="title"
                placeholder="時間割の名前"
                variant="flushed"
                value={title}
                onChange={(e) =>
                  setter((val) => ({ ...val, title: e.target.value }))
                }
                isInvalid={!title}
              />
              <Input
                textStyle="title"
                placeholder="時間割の説明"
                variant="flushed"
                value={description ?? ''}
                onChange={(e) =>
                  setter((val) => ({ ...val, description: e.target.value }))
                }
              />
              <HStack w="full">
                <Text textStyle="title">非公開</Text>
                <Spacer />
                <Switch isChecked={isPrivate} onChange={onVisibilityChange} />
              </HStack>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <VStack w="full">
                    <HStack w="full">
                      <Text textStyle="title">学年</Text>
                      <Spacer />
                      <Menu>
                        <MenuButton
                          as={Button}
                          isDisabled={!!_id}
                          rightIcon={<Icon as={TbChevronDown} />}
                          variant="ghost"
                          rounded="lg"
                        >
                          {
                            gradeList?.find(
                              (grade) =>
                                grade.type === meta.type &&
                                grade.gradeCode === meta.grade,
                            )?.name
                          }
                        </MenuButton>
                        <MenuList shadow="lg" rounded="xl">
                          {gradeList?.map((gradeInfo) => (
                            <MenuItem
                              textStyle="title"
                              onClick={() =>
                                setter((val) => ({
                                  ...val,
                                  meta: {
                                    ...val.meta,
                                    type: gradeInfo.type,
                                    grade: gradeInfo.gradeCode,
                                    course: undefined,
                                  },
                                }))
                              }
                            >
                              {gradeInfo.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </HStack>
                    <HStack w="full">
                      <Text textStyle="title">クラス</Text>
                      <Spacer />
                      <Menu>
                        <MenuButton
                          as={Button}
                          bg={!meta.class ? 'invalid' : undefined}
                          isDisabled={!!_id}
                          rightIcon={<Icon as={TbChevronDown} />}
                          variant="ghost"
                          rounded="lg"
                        >
                          {
                            classList?.find(
                              (classInfo) =>
                                classInfo.type === meta.type &&
                                classInfo.gradeCode === meta.grade &&
                                classInfo.classCode === meta.class,
                            )?.name
                          }
                        </MenuButton>
                        <MenuList shadow="lg" rounded="xl">
                          {classList?.map((classInfo) => (
                            <MenuItem
                              textStyle="title"
                              onClick={() =>
                                setter((val) => ({
                                  ...val,
                                  meta: {
                                    ...val.meta,
                                    type: classInfo.type,
                                    grade: classInfo.gradeCode,
                                    class: classInfo.classCode,
                                  },
                                }))
                              }
                            >
                              {classInfo.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </HStack>
                    {courseList?.length && (
                      <HStack w="full">
                        <Text textStyle="title">コース</Text>
                        <Spacer />
                        <Menu>
                          <MenuButton
                            as={Button}
                            bg={!meta.course ? 'invalid' : undefined}
                            isDisabled={!!_id}
                            rightIcon={<Icon as={TbChevronDown} />}
                            variant="ghost"
                            rounded="lg"
                          >
                            {
                              courseList?.find(
                                (courseInfo) => courseInfo.code === meta.course,
                              )?.name
                            }
                          </MenuButton>
                          <MenuList shadow="lg" rounded="xl">
                            {courseList?.map((courseInfo) => (
                              <MenuItem
                                textStyle="title"
                                onClick={() =>
                                  setter((val) => ({
                                    ...val,
                                    meta: {
                                      ...val.meta,
                                      course: courseInfo.code,
                                    },
                                  }))
                                }
                              >
                                {courseInfo.name}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </HStack>
                    )}
                  </VStack>
                </PopoverTrigger>
                <PopoverContent
                  p={4}
                  bg="panel"
                  shadow="lg"
                  rounded="xl"
                  borderColor="border"
                >
                  <PopoverBody>
                    <HStack w="full" justify="center">
                      <Icon
                        as={TbExclamationCircle}
                        boxSize={6}
                        color="yellow.400"
                      />
                      <Text textStyle="title">作成後は変更できません。</Text>
                    </HStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </VStack>
          </Collapse>
        </Box>
      </VStack>
    );
  },
);

const EditorTable = React.memo(
  ({
    schedules,
    meta,
    isPrivate,
    week,
    setter,
  }: {
    schedules: UserSchedule['schedules'][typeof week];
    meta: UserSchedule['meta'];
    isPrivate: UserSchedule['private'];
    week: Week;
    setter: React.Dispatch<React.SetStateAction<UserSchedule>>;
  }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <VStack
        w="full"
        rounded="xl"
        border="1px solid"
        borderColor="border"
        spacing={0}
        overflow="hidden"
      >
        <HStack p={4} w="full" onClick={onToggle} layerStyle="button">
          <Text textStyle="title" fontSize="xl">
            {week}週
          </Text>
          <Spacer />
          <Icon
            as={TbChevronDown}
            transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            transition="all .2s ease"
          />
        </HStack>
        <Box w="full">
          <Collapse in={isOpen} unmountOnExit>
            <SimpleGrid w="full" p={4} pt={8} columns={7} gap={1}>
              {schedules?.map((weekSchedule, index) => (
                <EditorTableCol
                  schedule={weekSchedule}
                  meta={meta}
                  isPrivate={isPrivate}
                  week={week}
                  dayIndex={index}
                  setter={setter}
                />
              ))}
            </SimpleGrid>
          </Collapse>
        </Box>
      </VStack>
    );
  },
);

const EditorTableCol = React.memo(
  ({
    schedule,
    meta,
    isPrivate,
    week,
    dayIndex,
    setter,
  }: {
    schedule: UserSchedule['schedules']['A'][0];
    meta: UserSchedule['meta'];
    isPrivate: UserSchedule['private'];
    week: Week;
    dayIndex: number;
    setter: React.Dispatch<React.SetStateAction<UserSchedule>>;
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <VStack
        // eslint-disable-next-line react/no-array-index-key
        key={JSON.stringify(schedule) + dayIndex}
        spacing={1}
      >
        <Text
          w="full"
          textAlign="center"
          textStyle="description"
          fontWeight="bold"
        >
          {days[dayIndex]}
        </Text>
        {schedule.map((period, index) => (
          <EditorSubjectGrid
            // eslint-disable-next-line react/no-array-index-key
            key={`${period.subjectId} + ${index}`}
            subjectId={period.subjectId}
            onDelete={() =>
              setter((oldSchedule) => ({
                ...oldSchedule,
                schedules: {
                  ...oldSchedule.schedules,
                  [week]: oldSchedule.schedules[week].map((daySch, idx) =>
                    dayIndex === idx
                      ? schedule.filter((_, i) => index !== i)
                      : daySch,
                  ),
                },
              }))
            }
          />
        ))}
        <IconButton
          w="full"
          aria-label="Add period"
          rounded="lg"
          icon={<Icon as={TbPlus} />}
          variant="outline"
          onClick={onOpen}
        />
        <AddUserSubjectDrawer
          isOpen={isOpen}
          onClose={(subjectId) => {
            if (subjectId !== undefined)
              setter((oldSchedule) => ({
                ...oldSchedule,
                schedules: {
                  ...oldSchedule.schedules,
                  [week]: oldSchedule.schedules[week].map((weekSch, idx) =>
                    idx === dayIndex ? [...schedule, { subjectId }] : weekSch,
                  ),
                },
              }));
            onClose();
          }}
          meta={meta}
          isPrivate={isPrivate}
        />
      </VStack>
    );
  },
);

function EditorSubjectGrid({
  subjectId,
  onDelete,
}: {
  subjectId?: string | null;
  onDelete: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, status } = useUserSubject(subjectId ?? '', {
    enabled: !!subjectId,
  });

  return (
    <Center
      bg="accent"
      p={1}
      rounded="lg"
      // border="1px solid"
      // borderColor="border"
      w="full"
      h={16}
      overflow="hidden"
      layerStyle="button"
      onClick={onOpen}
    >
      {status === 'pending' ? (
        <Loading />
      ) : status === 'error' ? (
        <Icon as={TbExclamationCircle} />
      ) : (
        <Text
          textAlign="center"
          textStyle="title"
          fontSize="sm"
          wordBreak="break-all"
        >
          {subjectId ? data.short_name ?? data.name : '-'}
        </Text>
      )}
      <Portal>
        <UserSubjectEditor
          isOpen={isOpen}
          onClose={onClose}
          onDelete={onDelete}
          subjectId={subjectId}
        />
      </Portal>
    </Center>
  );
}
