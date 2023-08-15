import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  StackDivider,
  StackProps,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format, parse, startOfDay } from 'date-fns/esm';
import { TbChevronDown, TbPencil, TbPlus, TbTrash, TbX } from 'react-icons/tb';
import { CreatableSelect } from 'chakra-react-select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useTimetable } from '@/hooks/timetable';
import WeekDayPicker from './WeekDayPicker';
import { useClassList, useCourseList, useSubjectList } from '@/hooks/info';
import { useClient } from '@/modules/client';

interface TableEditorProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  type: Type;
  grade: number;
  class: number;
  course: Course;
}

interface EditorContextProps {
  type: Type;
  grade: number;
}

const EditorContext = React.createContext<EditorContextProps | null>(null);

export default function TableEditor({
  isOpen,
  onClose,
  date,
  type,
  grade,
  class: schoolClass,
  course,
}: TableEditorProps) {
  const { client } = useClient();
  const queryClient = useQueryClient();
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });
  const [newSchedule, setSchedule] = useState<DaySchedule>();
  const [day, setDay] = useState<Day>();
  const [week, setWeek] = useState<Week>();
  const { data: classList } = useClassList({ type, grade });
  const { data: courseList } = useCourseList({ type, grade });

  const { mutate, isLoading } = useMutation<DaySchedule, AxiosError>(
    async () =>
      (
        await client.post<DaySchedule, AxiosResponse<DaySchedule>, DaySchedule>(
          '/timetable',
          {
            _id: schedule?.[0]._id,
            ...newSchedule!,
            date: startOfDay(date).toISOString(),
            target: [
              {
                type,
                grade,
                class: schoolClass,
                course,
              },
            ],
          }
        )
      ).data,
    {
      onSuccess: () => {
        toast({
          title: '変更しました。',
          status: 'success',
        });
        queryClient.invalidateQueries([
          'timetable',
          {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            type,
            grade,
            class: schoolClass,
          },
        ]);

        onClose();
      },
      onError: (error) => {
        toast({
          title: '保存に失敗しました。',
          description: error.message,
          status: 'error',
        });
      },
    }
  );

  const { data: schedule } = useTimetable(
    {
      date,
      type,
      grade,
      class: schoolClass,
      course: [course],
    },
    {
      enabled: isOpen,
    }
  );

  const { data: defaultSchedule, mutate: defaultScheduleMutate } = useMutation<
    DaySchedule[],
    AxiosError,
    { newWeek: Week; newDay: Day }
  >(
    async ({ newWeek, newDay }) =>
      (
        await client.get('/timetable', {
          params: {
            type,
            grade,
            class: schoolClass,
            course,
            week: newWeek,
            dayOfWeek: newDay,
          },
        })
      ).data
  );

  useEffect(() => {
    if (!schedule) return;
    setSchedule(schedule[0]);
    setDay(schedule[0].schedule.day);
    setWeek(schedule[0].schedule.week);
  }, [schedule, date]);

  useEffect(() => {
    const newDaySchedule = defaultSchedule?.find(
      (daySchedule) =>
        daySchedule.meta.type === type &&
        daySchedule.meta.grade === grade &&
        daySchedule.meta.class === schoolClass &&
        daySchedule.meta.course.code === course
    );
    if (!newDaySchedule) return;

    newDaySchedule.timetable = newDaySchedule?.timetable.map((period) => ({
      ...period,
      startAt: parse(period.startAt, 'HH:mm', date).toISOString(),
      endAt: parse(period.endAt, 'HH:mm', date).toISOString(),
    }));
    setSchedule(newDaySchedule);
  }, [defaultSchedule, date]); // eslint-disable-line react-hooks/exhaustive-deps

  const onWeekSelect = useCallback(
    (newWeek: Week) => {
      setWeek(newWeek);
      defaultScheduleMutate({ newWeek, newDay: day! });
    },
    [day] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const onDaySelect = useCallback(
    (newDay: Day) => {
      setDay(newDay);
      defaultScheduleMutate({ newWeek: week!, newDay });
    },
    [week] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onDragEnd = (result: any) => {
    const timetable = newSchedule?.timetable;
    if (!timetable) return;
    const reorderedItem = timetable.splice(result.source.index, 1)[0];
    timetable.splice(result.destination.index, 0, reorderedItem);

    setSchedule((oldSchedule) => ({
      ...oldSchedule!,
      timetable,
    }));
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <EditorContext.Provider value={{ type, grade }}>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent top={0} bg="panel" pb={4}>
          <DrawerHeader w="full" maxW="container.lg" mx="auto">
            <HStack spacing={2}>
              <Text>時間割の編集</Text>
              <Spacer />
              <Text textStyle="description">
                {grade}-
                {
                  classList?.find(
                    (classInfo) => schoolClass === classInfo.class_num
                  )?.short_name
                }{' '}
                {
                  courseList?.find((courseInfo) => courseInfo.code === course)
                    ?.name
                }
              </Text>
              <IconButton
                aria-label="close drawer"
                icon={<TbX />}
                variant="ghost"
                rounded="lg"
                onClick={onClose}
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody w="full" maxW="container.lg" mx="auto">
            <VStack align="flex-start" w="100%">
              <Text textStyle="title">日課</Text>
              <WeekDayPicker
                onWeekSelect={onWeekSelect}
                onDaySelect={onDaySelect}
                week={week}
                day={day}
              />
              <Text textStyle="title">時間割</Text>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="timetable">
                  {(droppableProvided) => (
                    <VStack
                      w="100%"
                      spacing={0}
                      divider={<StackDivider />}
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      {newSchedule?.timetable.map((period, index) => (
                        <Draggable
                          key={period.startAt}
                          draggableId={period.startAt}
                          index={index}
                        >
                          {(draggableProvided) => (
                            <Box
                              bg="panel"
                              w="100%"
                              px={2}
                              py={1}
                              rounded="lg"
                              _active={{
                                border: '1px solid',
                                borderColor: 'border',
                                shadow: 'xl',
                              }}
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                            >
                              <TimetableEditorPeriod
                                period={period}
                                onPeriodChange={(newPeriod) =>
                                  setSchedule((oldSchedule) => ({
                                    ...oldSchedule!,
                                    timetable:
                                      oldSchedule?.timetable.map(
                                        (oldPeriod, oldIndex) =>
                                          index === oldIndex
                                            ? newPeriod
                                            : oldPeriod
                                      ) ?? [],
                                  }))
                                }
                                onDelete={() =>
                                  setSchedule((oldSchedule) => ({
                                    ...oldSchedule!,
                                    timetable:
                                      oldSchedule?.timetable.filter(
                                        (_, idx) => index !== idx
                                      ) ?? [],
                                  }))
                                }
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {droppableProvided.placeholder}
                    </VStack>
                  )}
                </Droppable>
              </DragDropContext>
              <Button
                variant="ghost"
                w="100%"
                rounded="lg"
                leftIcon={<TbPlus />}
                onClick={() => {
                  setSchedule((oldSchedule) => ({
                    ...oldSchedule!,
                    timetable: [
                      ...(oldSchedule?.timetable ?? []),
                      {
                        start: 0,
                        end: 0,
                        startAt: startOfDay(date).toISOString(),
                        endAt: startOfDay(date).toISOString(),
                      },
                    ],
                  }));
                }}
              >
                時限を追加
              </Button>
            </VStack>
          </DrawerBody>
          <DrawerFooter
            w="full"
            maxW="container.lg"
            mx="auto"
            pb="env(safe-area-inset-bottom)"
          >
            <Button
              colorScheme="blue"
              w="100%"
              rounded="lg"
              onClick={() => {
                mutate();
              }}
              isLoading={isLoading}
            >
              時間割を更新
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </EditorContext.Provider>
  );
}

function TimetableEditorPeriod({
  period,
  onPeriodChange,
  onDelete,
  ...rest
}: {
  period: Period;
  onPeriodChange: (period: Period) => void;
  onDelete: () => void;
} & StackProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="100%" key={period.subject?.name} {...rest}>
      <HStack w="100%" spacing={8}>
        <VStack spacing={-1} align="center">
          <HStack>
            <Text textStyle="title" fontSize="xl">
              {period.start}
            </Text>
            <Text textStyle="description" fontSize="2xs">
              {format(new Date(period.startAt), 'HH:mm')}
            </Text>
          </HStack>
          <Icon as={TbChevronDown} color="description" />
          <HStack>
            <Text textStyle="title" fontSize="xl">
              {period.end}
            </Text>
            <Text textStyle="description" fontSize="2xs">
              {format(new Date(period.endAt), 'HH:mm')}
            </Text>
          </HStack>
        </VStack>
        <Text textStyle="title" fontSize="xl">
          {period.subject?.name}
        </Text>
        <Spacer />
        <PeriodEditor
          isOpen={isOpen}
          onClose={onClose}
          period={period}
          onPeriodChange={onPeriodChange}
        />
        <HStack>
          <IconButton
            aria-label="edit subject"
            icon={<Icon as={TbPencil} h={5} w={5} />}
            variant="ghost"
            rounded="lg"
            onClick={onOpen}
          />
          <IconButton
            aria-label="delete subject"
            icon={<Icon as={TbTrash} h={5} w={5} />}
            colorScheme="red"
            variant="ghost"
            rounded="lg"
            onClick={onDelete}
          />
        </HStack>
      </HStack>
    </VStack>
  );
}

function PeriodEditor({
  isOpen,
  onClose,
  period,
  onPeriodChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  period: Period;
  onPeriodChange: (period: Period) => void;
}) {
  const { type, grade } = useContext(EditorContext)!;
  const [newPeriod, setPeriod] = useState<
    Omit<Period, 'start' | 'end'> & Partial<Pick<Period, 'start' | 'end'>>
  >(period);
  const initialRef = useRef(null);

  const { data: subjectList } = useSubjectList({ type, grade });

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent rounded="xl" bg="panel">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>教科の編集</ModalHeader>
        <ModalBody>
          <VStack w="100%" align="flex-start" spacing={4}>
            <Text textStyle="title">開始時間・終了時間</Text>
            <VStack w="100%">
              <HStack w="100%">
                <Input
                  flex={1}
                  textStyle="title"
                  type="number"
                  value={newPeriod.start}
                  textAlign="center"
                  isInvalid={!newPeriod.start}
                  ref={initialRef}
                  onChange={(e) =>
                    setPeriod((oldPeriod) => ({
                      ...oldPeriod,
                      start: Number(e.target.value) || undefined,
                    }))
                  }
                />
                <Text textStyle="title" flexShrink={0}>
                  時間目
                </Text>
                <Input
                  flex={4}
                  textStyle="title"
                  type="time"
                  value={format(new Date(newPeriod.startAt), 'HH:mm')}
                  onChange={(e) =>
                    setPeriod((oldPeriod) => ({
                      ...oldPeriod,
                      startAt: parse(
                        e.target.value,
                        'HH:mm',
                        new Date(oldPeriod.startAt)
                      ).toISOString(),
                    }))
                  }
                />
              </HStack>
              <Icon as={TbChevronDown} />
              <HStack w="100%">
                <Input
                  flex={1}
                  textStyle="title"
                  type="number"
                  value={newPeriod.end}
                  textAlign="center"
                  onChange={(e) =>
                    setPeriod((oldPeriod) => ({
                      ...oldPeriod,
                      end: Number(e.target.value) || undefined,
                    }))
                  }
                />
                <Text textStyle="title" flexShrink={0}>
                  時間目
                </Text>
                <Input
                  flex={4}
                  textStyle="title"
                  type="time"
                  value={format(new Date(newPeriod.endAt), 'HH:mm')}
                  onChange={(e) =>
                    setPeriod((oldPeriod) => ({
                      ...oldPeriod,
                      endAt: parse(
                        e.target.value,
                        'HH:mm',
                        new Date(oldPeriod.endAt)
                      ).toISOString(),
                    }))
                  }
                />
              </HStack>
            </VStack>
            <Text textStyle="title">教科</Text>
            <CreatableSelect
              placeholder="教科を選択"
              defaultValue={{
                label: period.subject?.name,
                value: period.subject?.code,
              }}
              menuPlacement="bottom"
              options={subjectList?.map((subject) => ({
                label: subject.name,
                value: subject.code,
              }))}
              formatCreateLabel={(inputValue) => (
                <HStack>
                  <Icon as={TbPlus} />
                  <Text>{`"${inputValue}" を作成`}</Text>
                </HStack>
              )}
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  w: '100%',
                  textStyle: 'title',
                }),
                menu: (provided) => ({
                  ...provided,
                  shadow: 'lg',
                  top: 0,
                  zIndex: 2,
                }),
              }}
              onChange={(value) => {
                setPeriod((oldPeriod) => ({
                  ...oldPeriod,
                  subject: subjectList?.find(
                    (subject) => value?.value === subject.code
                  ) ?? { name: value?.value },
                }));
              }}
            />
            <Text textStyle="title">備考など</Text>
            <Textarea
              textStyle="title"
              value={newPeriod.subject?.description}
              onChange={(e) =>
                setPeriod((oldPeriod) => ({
                  ...oldPeriod,
                  subject: {
                    code: oldPeriod.subject?.code,
                    name: oldPeriod.subject?.name!,
                    description: e.target.value,
                  },
                }))
              }
              as={ResizeTextArea}
              resize="none"
              maxH={48}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            w="100%"
            colorScheme="blue"
            rounded="lg"
            disabled={
              !newPeriod.start ||
              !newPeriod.end ||
              !newPeriod.startAt ||
              !newPeriod.endAt
            }
            onClick={() => {
              onPeriodChange(newPeriod as Period);
              onClose();
            }}
          >
            更新
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
