import {
  Box,
  Button,
  Center,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import {
  TbChevronDown,
  TbExclamationCircle,
  TbPencil,
  TbPlus,
  TbRepeat,
  TbTrash,
} from 'react-icons/tb';
import Loading from '@/components/common/Loading';
import { days } from '@/utils/date';
import { useUserSubject } from '@/services/timetable';
import UserSubjectEditor from './UserSubjectEditor';
import UserSubjectPicker from './UserSubjectPicker';
import { useUserScheduleContext } from './context';

export const EditorTable = React.memo(
  ({
    schedules,
    meta,
    isPrivate,
    week,
  }: {
    schedules: UserSchedule['schedules'][typeof week];
    meta: UserSchedule['meta'];
    isPrivate: UserSchedule['private'];
    week: Week;
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
            <SimpleGrid w="full" p={4} pt={8} columns={5} gap={1}>
              {schedules
                ?.slice(1, 6)
                .map((weekSchedule, index) => (
                  <EditorTableCol
                    schedule={weekSchedule}
                    meta={meta}
                    isPrivate={isPrivate}
                    week={week}
                    dayIndex={index + 1}
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
  }: {
    schedule: UserSchedule['schedules']['A'][number];
    meta: UserSchedule['meta'];
    isPrivate: UserSchedule['private'];
    week: Week;
    dayIndex: number;
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [, setSchedule] = useUserScheduleContext();

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
            meta={meta}
            isPrivate={isPrivate}
            onReplace={(subjectId) => {
              if (subjectId)
                setSchedule((oldSchedule) => ({
                  ...oldSchedule,
                  schedules: {
                    ...oldSchedule.schedules,
                    [week]: oldSchedule.schedules[week].map((daySch, idx) =>
                      dayIndex === idx
                        ? schedule.with(index, {
                            subjectId,
                          })
                        : daySch,
                    ),
                  },
                }));
            }}
            onDelete={() =>
              setSchedule((oldSchedule) => ({
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
        <UserSubjectPicker
          isOpen={isOpen}
          onSelect={(subjectId) => {
            if (subjectId !== undefined)
              setSchedule((oldSchedule) => ({
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
          onCancel={onClose}
          meta={meta}
          isPrivate={isPrivate}
        />
      </VStack>
    );
  },
);

function EditorSubjectGrid({
  subjectId,
  meta,
  isPrivate,
  onReplace,
  onDelete,
}: {
  subjectId?: string | null;
  meta: UserSchedule['meta'];
  isPrivate: UserSchedule['private'];
  onReplace: (subjectId?: string | null) => void;
  onDelete: () => void;
}) {
  const {
    isOpen: isEditorOpen,
    onOpen: onEditorOpen,
    onClose: onEditorClose,
  } = useDisclosure();
  const {
    isOpen: isPickerOpen,
    onOpen: onPickerOpen,
    onClose: onPickerClose,
  } = useDisclosure();
  const { data, status } = useUserSubject(subjectId ?? '', {
    enabled: !!subjectId,
  });

  return (
    <>
      <Popover>
        <PopoverTrigger>
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
          </Center>
        </PopoverTrigger>
        <PopoverContent p={0} bg="panel" rounded="xl" width="fit-content">
          <PopoverArrow bg="panel" />
          <PopoverBody p={4}>
            <VStack spacing={1}>
              <Button
                variant="ghost"
                rounded="lg"
                w="full"
                leftIcon={<Icon as={TbPencil} />}
                onClick={onEditorOpen}
              >
                教科の編集
              </Button>
              <Button
                variant="ghost"
                rounded="lg"
                w="full"
                leftIcon={<Icon as={TbRepeat} />}
                onClick={onPickerOpen}
              >
                置き換え
              </Button>
              <Button
                variant="ghost"
                rounded="lg"
                w="full"
                colorScheme="red"
                leftIcon={<Icon as={TbTrash} />}
                onClick={onDelete}
              >
                削除
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <UserSubjectPicker
        isOpen={isPickerOpen}
        onSelect={onReplace}
        onCancel={onPickerClose}
        meta={meta}
        isPrivate={isPrivate}
      />
      <UserSubjectEditor
        isOpen={isEditorOpen}
        onClose={onEditorClose}
        subjectId={subjectId}
      />
    </>
  );
}
