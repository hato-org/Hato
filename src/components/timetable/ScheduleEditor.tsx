import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Switch,
  Text,
  useDisclosure,
  useRadio,
  useRadioGroup,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TbArrowBarRight,
  TbArrowBarToRight,
  TbMinus,
  TbPlus,
  TbX,
} from 'react-icons/tb';
import { format, getDay, startOfDay } from 'date-fns/esm';
import { AxiosError, AxiosResponse } from 'axios';
import { ja } from 'date-fns/locale';
import { useGradeList } from '@/hooks/info';
import { useClient } from '@/modules/client';
import WeekDayPicker from './WeekDayPicker';
import { useSchedule, useSchedulePlaceholder } from '@/hooks/timetable';

interface GradeSchedule {
  type: Type;
  grade: number;
  timetable: {
    index: number;
    startAt: string;
    endAt: string;
  }[];
}

interface ScheduleEditorProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleEditor = React.memo(
  ({ date, isOpen, onClose }: ScheduleEditorProps) => {
    const { client } = useClient();
    const queryClient = useQueryClient();
    const toast = useToast({
      position: 'top-right',
      variant: 'left-accent',
    });
    const { getRootProps, getRadioProps } = useRadioGroup({
      name: 'Schedule type',
      // defaultValue: 'batch',
    });
    const group = getRootProps();
    const { mutate: mutateSchedule } = useSchedule(
      {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      {
        onSuccess: (previousSchedule) => {
          setWeek(previousSchedule.week);
          setDay(previousSchedule.day);
          setIsIrregular(previousSchedule.irregular);
          setSchedule(previousSchedule);
        },
      }
    );

    useEffect(() => {
      setDay(getDay(date));
      mutateSchedule();
    }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

    const [week, setWeek] = useState<Week>('A');
    const [day, setDay] = useState<Day>(getDay(date));
    const [isIrregular, setIsIrregular] = useState(false);

    const [newSchedule, setSchedule] = useState<Schedule>({
      date: startOfDay(date),
      week,
      day,
      schedule: [],
      irregular: isIrregular,
    });

    const { mutate, isLoading } = useMutation<Schedule, AxiosError>(
      async () =>
        (
          await client.post<
            Schedule,
            AxiosResponse<Schedule, Schedule>,
            Schedule
          >('/timetable/schedule', {
            ...newSchedule!,
            week,
            day,
            date: startOfDay(date),
            irregular: isIrregular,
          })
        ).data,
      {
        onSuccess: () => {
          onClose();
          toast({
            title: '更新しました。',
            status: 'success',
          });
          queryClient.invalidateQueries([
            'timetable',
            {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
          ]);
        },
        onError: (error) => {
          toast({
            title: '更新に失敗しました。',
            description: error.message,
            status: 'error',
          });
        },
      }
    );

    const options = useMemo(
      () => [
        {
          title: '一括で設定する',
          value: 'batch',
          children: (
            <BatchSchedule
              onScheduleChange={(nSchedule) =>
                setSchedule((oldSchedule) => ({
                  ...oldSchedule!,
                  schedule: nSchedule,
                }))
              }
            />
          ),
        },
        {
          title: '学年ごとに設定する',
          value: 'individual',
          children: (
            <IndividualSchedule
              onScheduleChange={(nSchedule) =>
                setSchedule((oldSchedule) => ({
                  ...oldSchedule!,
                  schedule: nSchedule,
                }))
              }
            />
          ),
        },
      ],
      []
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded="xl" bg="panel">
          <ModalHeader>
            <HStack align="center">
              <Text>日課の編集</Text>
              <Spacer />
              <Text textStyle="description">
                {format(date, 'MM/dd (E)', { locale: ja })}
              </Text>
              <IconButton
                aria-label="close modal"
                icon={<Icon as={TbX} w={4} h={4} />}
                variant="ghost"
                rounded="lg"
                size="sm"
                onClick={() => onClose()}
              />
            </HStack>
          </ModalHeader>
          <ModalBody>
            <VStack align="stretch" {...group}>
              <Heading size="md">日課</Heading>
              <WeekDayPicker
                week={week}
                day={day}
                onWeekSelect={setWeek}
                onDaySelect={setDay}
              />
              <HStack py={4} px={4}>
                <Text textStyle="title">特編</Text>
                <Spacer />
                <Switch
                  isChecked={isIrregular}
                  onChange={() => setIsIrregular(!isIrregular)}
                />
              </HStack>
              {options.map(({ title, value, children }) => {
                const radio = getRadioProps({ value });
                return (
                  <ScheduleRadio key={value} title={title} {...radio}>
                    {children}
                  </ScheduleRadio>
                );
              })}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() => mutate()}
              isLoading={isLoading}
            >
              更新
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

const ScheduleRadio = React.memo(
  (props: { title: string; children: JSX.Element }) => {
    const { title, children, ...radioProps } = props;
    const { state, getInputProps, getCheckboxProps } = useRadio(radioProps);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
      <VStack
        as="label"
        role="group"
        align="stretch"
        rounded="lg"
        border="1px solid"
        borderColor="border"
        _checked={{
          // bg: 'blue.700',
          borderColor: 'border-accent',
        }}
        overflow="hidden"
        spacing={0}
        transition="all .2s ease"
        {...checkbox}
      >
        <HStack
          role="group"
          px={4}
          py={2}
          _groupChecked={{ bg: 'accent' }}
          _hover={{ cursor: 'pointer' }}
          transition="all .2s ease"
        >
          <Text textStyle="title">{title}</Text>
        </HStack>
        <Input {...input} hidden />
        <Collapse in={state.isChecked}>{children}</Collapse>
      </VStack>
    );
  }
);

const BatchSchedule = React.memo(
  ({
    onScheduleChange,
  }: {
    onScheduleChange: (schedule: GradeSchedule[]) => void;
  }) => {
    const { data: gradeList } = useGradeList();
    const { data: placeholder } = useSchedulePlaceholder();

    const [periods, setPeriod] = useState(
      [...Array(6).keys()].map((i) => ({
        index: i + 1,
        startAt: '',
        endAt: '',
      }))
    );

    useEffect(() => {
      setPeriod((oldPeriods) =>
        oldPeriods.map((period, index) => ({
          ...period,
          startAt: placeholder?.[index].startAt ?? '',
          endAt: placeholder?.[index].endAt ?? '',
        }))
      );
    }, [placeholder]);

    useEffect(() => {
      onScheduleChange(
        gradeList?.map((gradeInfo) => ({
          type: gradeInfo.type,
          grade: gradeInfo.grade_num,
          timetable: periods,
        }))!
      );
    }, [periods]); // eslint-disable-line react-hooks/exhaustive-deps

    const onDragEnd = useCallback(
      (result: DropResult) => {
        const items = [...periods];
        const reordered = items.splice(result.source.index, 1)[0];
        if (
          result.destination?.index !== undefined &&
          result.destination?.index !== null
        )
          items.splice(
            result.destination.index ?? periods.length,
            0,
            reordered
          );

        setPeriod(items);
      },
      [periods]
    );

    const onOrderChange = useCallback(
      (
        value: { index: number; startAt: string; endAt: string },
        index: number
      ) => {
        setPeriod((oldPeriods) => {
          const newPeriods = [...oldPeriods];
          newPeriods.splice(index, 1, {
            ...value,
          });
          return newPeriods;
        });
      },
      []
    );

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <VStack px={4} py={2} align="stretch">
          <HStack
            w="100%"
            align="center"
            textStyle="description"
            fontWeight="bold"
          >
            <Text fontSize="xs">朝</Text>
            <Divider borderColor="description" border="0.5px solid" />
            <Text fontSize="xs">夜</Text>
          </HStack>
          <Droppable droppableId="schedule" direction="horizontal">
            {(droppableProvided, snapshot) => (
              <VStack spacing={0}>
                <HStack
                  spacing={0}
                  w="100%"
                  align="stretch"
                  overflowX="auto"
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                >
                  {periods.map((period, index) => (
                    <DraggablePeriod
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${index}-${period.index}`}
                      period={period}
                      index={index}
                      onChange={onOrderChange}
                    />
                  ))}
                  {droppableProvided.placeholder}
                  <VStack
                    px={4}
                    py={2}
                    rounded="lg"
                    bg="popover"
                    justify="center"
                    layerStyle="button"
                    onClick={() => {
                      setPeriod((oldPeriods) => [
                        ...oldPeriods,
                        {
                          index: oldPeriods.length + 1,
                          startAt: '',
                          endAt: '',
                        },
                      ]);
                    }}
                  >
                    <Icon as={TbPlus} />
                  </VStack>
                </HStack>
                <Collapse in={snapshot.draggingFromThisWith !== null}>
                  {snapshot.isDraggingOver ? (
                    <Text pt={2} textStyle="description" fontWeight="bold">
                      枠外にドラッグで削除
                    </Text>
                  ) : (
                    <Text
                      pt={2}
                      textStyle="description"
                      fontWeight="bold"
                      color="red.500"
                    >
                      ドロップして削除
                    </Text>
                  )}
                </Collapse>
              </VStack>
            )}
          </Droppable>
        </VStack>
      </DragDropContext>
    );
  }
);

const IndividualSchedule = React.memo(
  ({
    onScheduleChange,
  }: {
    onScheduleChange: (schedule: GradeSchedule[]) => void;
  }) => {
    const [schedule, setSchedule] = useState<GradeSchedule[]>();
    const { data: gradeList } = useGradeList();
    const { data: placeholder } = useSchedulePlaceholder();

    useEffect(() => {
      if (!gradeList || !placeholder) return;
      setSchedule(
        gradeList.map((gradeInfo) => ({
          type: gradeInfo.type,
          grade: gradeInfo.grade_num,
          timetable: [...Array(6).keys()].map((i) => ({
            index: i + 1,
            startAt: placeholder[i].startAt,
            endAt: placeholder[i].endAt,
          })),
        }))
      );
    }, [gradeList, placeholder]);

    useEffect(() => {
      onScheduleChange(schedule!);
    }, [schedule]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <VStack align="stretch" p={4}>
        {schedule?.map((gradeSchedule, index) => {
          const gradeInfo = gradeList?.find(
            (gInfo) =>
              gInfo.type === gradeSchedule.type &&
              gInfo.grade_num === gradeSchedule.grade
          );

          const onDragEnd = (result: DropResult) => {
            const items = [...gradeSchedule.timetable];
            const reordered = items.splice(result.source.index, 1)[0];
            if (
              result.destination?.index !== undefined &&
              result.destination?.index !== null
            )
              items.splice(
                result.destination.index ?? gradeSchedule.timetable.length,
                0,
                reordered
              );

            setSchedule((oldSchedule) => {
              const newSchedule = [...(oldSchedule ?? [])];

              newSchedule[index].timetable = items;
              return newSchedule;
            });
          };

          return (
            <VStack key={gradeInfo?.name} spacing={0} align="stretch">
              <Text textStyle="title">{gradeInfo?.name}</Text>
              <DragDropContext onDragEnd={onDragEnd}>
                <VStack px={0} py={2} align="stretch">
                  <HStack
                    w="100%"
                    align="center"
                    textStyle="description"
                    fontWeight="bold"
                  >
                    <Text fontSize="xs">朝</Text>
                    <Divider borderColor="description" border="0.5px solid" />
                    <Text fontSize="xs">夜</Text>
                  </HStack>
                  <Droppable
                    droppableId={`schedule-individual-${gradeInfo?.name}`}
                    direction="horizontal"
                  >
                    {(droppableProvided, snapshot) => (
                      <VStack spacing={0}>
                        <HStack
                          spacing={0}
                          w="100%"
                          align="stretch"
                          overflowX="auto"
                          {...droppableProvided.droppableProps}
                          ref={droppableProvided.innerRef}
                        >
                          {gradeSchedule.timetable.map(
                            (period, periodIndex) => (
                              <DraggablePeriod
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${periodIndex}-${period.index}`}
                                period={period}
                                index={periodIndex}
                                onChange={(newPeriod) => {
                                  setSchedule((oldSchedule) => {
                                    const newSchedule = [
                                      ...(oldSchedule ?? []),
                                    ];

                                    newSchedule[index].timetable[periodIndex] =
                                      newPeriod;

                                    return newSchedule;
                                  });
                                }}
                              />
                            )
                          )}
                          {droppableProvided.placeholder}
                          <VStack
                            px={4}
                            py={2}
                            rounded="lg"
                            bg="popover"
                            justify="center"
                            layerStyle="button"
                            onClick={() => {
                              setSchedule((oldSchedule) => {
                                const newSchedule = [...(oldSchedule ?? [])];

                                newSchedule.splice(index, 1, {
                                  ...gradeSchedule,
                                  timetable: [
                                    ...gradeSchedule.timetable,
                                    {
                                      index: gradeSchedule.timetable.length + 1,
                                      startAt: '',
                                      endAt: '',
                                    },
                                  ],
                                });

                                return newSchedule;
                              });
                            }}
                          >
                            <Icon as={TbPlus} />
                          </VStack>
                        </HStack>
                        <Collapse in={snapshot.draggingFromThisWith !== null}>
                          {snapshot.isDraggingOver ? (
                            <Text
                              pt={2}
                              textStyle="description"
                              fontWeight="bold"
                            >
                              枠外にドラッグで削除
                            </Text>
                          ) : (
                            <Text
                              pt={2}
                              textStyle="description"
                              fontWeight="bold"
                              color="red.500"
                            >
                              ドロップして削除
                            </Text>
                          )}
                        </Collapse>
                      </VStack>
                    )}
                  </Droppable>
                </VStack>
              </DragDropContext>
            </VStack>
          );
        })}
      </VStack>
    );
  }
);

const DraggablePeriod = React.memo(
  ({
    period,
    index,
    onChange,
  }: {
    period: {
      index: number;
      startAt: string;
      endAt: string;
    };
    index: number;
    onChange: (
      value: {
        index: number;
        startAt: string;
        endAt: string;
      },
      index: number
    ) => void;
  }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <Draggable draggableId={`${period.index}-${index}`} index={index}>
        {(draggableProvided, snapshot) => (
          <Box>
            <Popover isOpen={isOpen}>
              <PopoverTrigger>
                <VStack
                  key={`${period.index}-${index}`}
                  mx={1}
                  px={4}
                  py={2}
                  rounded="lg"
                  border="1px solid"
                  borderColor="border"
                  bg={snapshot.isDragging ? 'popover' : 'panel'}
                  shadow={snapshot.isDragging ? 'lg' : 'none'}
                  justify="center"
                  {...draggableProvided.draggableProps}
                  {...draggableProvided.dragHandleProps}
                  transitionDuration="0.01s"
                  ref={draggableProvided.innerRef}
                  onClick={onToggle}
                >
                  <Text textStyle="title" fontSize="2xl">
                    {period.index}
                  </Text>
                </VStack>
              </PopoverTrigger>
              <PopoverContent p={2} bg="popover" rounded="xl" shadow="xl">
                <PopoverArrow bg="popover" />
                <PopoverBody>
                  <VStack>
                    <HStack spacing={4}>
                      <IconButton
                        aria-label="decrement period"
                        icon={<Icon as={TbMinus} />}
                        rounded="lg"
                        onClick={() =>
                          onChange(
                            { ...period, index: period.index - 1 },
                            index
                          )
                        }
                      />

                      <Input
                        type="number"
                        textAlign="center"
                        textStyle="title"
                        fontSize="2xl"
                        value={period.index}
                        onChange={(e) =>
                          onChange(
                            { ...period, index: Number(e.target.value) },
                            index
                          )
                        }
                      />
                      <IconButton
                        aria-label="increment period"
                        icon={<Icon as={TbPlus} />}
                        rounded="lg"
                        onClick={() =>
                          onChange(
                            { ...period, index: period.index + 1 },
                            index
                          )
                        }
                      />
                    </HStack>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={TbArrowBarRight} />
                      </InputLeftElement>
                      <Input
                        type="time"
                        value={period.startAt}
                        onChange={(e) =>
                          onChange(
                            { ...period, startAt: e.target.value },
                            index
                          )
                        }
                        textAlign="center"
                        textStyle="title"
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={TbArrowBarToRight} />
                      </InputLeftElement>
                      <Input
                        type="time"
                        value={period.endAt}
                        onChange={(e) =>
                          onChange({ ...period, endAt: e.target.value }, index)
                        }
                        textAlign="center"
                        textStyle="title"
                      />
                    </InputGroup>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
      </Draggable>
    );
  }
);

export default ScheduleEditor;
