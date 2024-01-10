import React from 'react';
import {
  Box,
  Button,
  Collapse,
  HStack,
  Icon,
  Spacer,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  TbCheck,
  TbChevronDown,
  TbDownload,
  TbPencil,
  TbX,
} from 'react-icons/tb';
import { useSetAtom } from 'jotai';
import { useUser, useUserMutation } from '@/services/user';
import { overlayAtom } from '@/store/overlay';
import { useUserSubject } from '@/services/timetable';
import { days } from '@/utils/date';
import { UserScheduleImportModal } from './UserScheduleImportModal';
import { useClassList, useCourseList, useGradeList } from '@/services/info';

const Card = React.memo(
  ({
    _id,
    title,
    description,
    schedules,
    owner,
    meta,
    ...rest
  }: UserSchedule) => {
    const { isOpen, onToggle } = useDisclosure();
    const {
      isOpen: importModalOpen,
      onOpen: importModalOnOpen,
      onClose: importModalOnClose,
    } = useDisclosure();
    const setOverlay = useSetAtom(overlayAtom);
    const { data: user } = useUser();
    const { mutate, isPending } = useUserMutation();

    const { data: gradeList } = useGradeList();
    const { data: classList } = useClassList({
      type: meta.type,
      grade: meta.grade,
    });
    const { data: courseList } = useCourseList({
      type: meta.type,
      grade: meta.grade,
    });

    const isSelected = user.userScheduleId === _id;

    return (
      <VStack
        w="full"
        p={isOpen ? 6 : 4}
        bg={isOpen ? 'panel' : 'transparent'}
        rounded="xl"
        layerStyle={isOpen ? undefined : 'button'}
        spacing={0}
        shadow={isOpen ? 'xl' : 'none'}
        border="1px solid"
        borderColor={isOpen ? 'border' : 'transparent'}
        transition="all .3s ease"
      >
        <HStack w="full" onClick={onToggle} spacing={4}>
          <StackDivider
            borderWidth={2}
            borderColor={isSelected ? 'green.400' : 'blue.400'}
            rounded="full"
          />
          <VStack align="flex-start" spacing={1}>
            <Text textStyle="title" noOfLines={1}>
              {title}
            </Text>
            <Text textStyle="description" noOfLines={1}>
              {description}
            </Text>
          </VStack>
          <Spacer />
          <Text color="description" whiteSpace="nowrap">
            {
              gradeList?.find(
                ({ type, gradeCode }) =>
                  type === meta.type && gradeCode === meta.grade,
              )?.shortName
            }
            -
            {
              classList?.find(
                ({ type, classCode }) =>
                  type === meta.type && classCode === meta.class,
              )?.shortName
            }{' '}
            {meta.course &&
              courseList?.find(({ code }) => code === meta.course)?.shortName}
          </Text>
          {/* <Icon
            as={isPrivate ? TbLock : TbWorld}
            boxSize={6}
            color="description"
          /> */}
          <Icon
            as={TbChevronDown}
            transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            transition="all .2s ease"
          />
        </HStack>
        <Box w="full">
          <Collapse in={isOpen}>
            <VStack w="full" pt={8} spacing={8}>
              <TableContainer w="full" overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>A週</Th>
                      {days.slice(1, 6).map((day) => (
                        <Th key={day}>{day}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.from({
                      length: Math.max(
                        ...schedules.A.map((daySchedule) => daySchedule.length),
                      ),
                    }).map((_, index) => (
                      <Tr>
                        <Td textStyle="title">{index + 1}</Td>
                        {schedules.A.slice(1, 6).map((daySchedule, idx) => (
                          <TablePeriod
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${days[index]}-${idx}`}
                            subjectId={daySchedule[index]?.subjectId}
                          />
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full" overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>B週</Th>
                      {days.slice(1, 6).map((day) => (
                        <Th key={day}>{day}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.from({
                      length: Math.max(
                        ...schedules.B.map((daySchedule) => daySchedule.length),
                      ),
                    }).map((_, index) => (
                      <Tr>
                        <Td textStyle="title">{index + 1}</Td>
                        {schedules.B.slice(1, 6).map((daySchedule) => (
                          <TablePeriod
                            subjectId={daySchedule[index]?.subjectId}
                          />
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              {owner === user._id ? (
                <HStack w="full">
                  <Button
                    w="full"
                    rounded="lg"
                    variant="ghost"
                    leftIcon={<Icon as={TbPencil} />}
                    onClick={() =>
                      setOverlay((currVal) => ({
                        ...currVal,
                        userScheduleEditor: _id!,
                      }))
                    }
                  >
                    編集
                  </Button>
                  <Button
                    w="full"
                    rounded="lg"
                    variant={isSelected ? 'outline' : 'solid'}
                    colorScheme={isSelected ? 'red' : 'blue'}
                    leftIcon={<Icon as={isSelected ? TbX : TbCheck} />}
                    onClick={() =>
                      mutate({ userScheduleId: isSelected ? null : _id })
                    }
                    isLoading={isPending}
                  >
                    {isSelected ? '使用をやめる' : '使用する'}
                  </Button>
                </HStack>
              ) : (
                <>
                  <VStack w="full" gap={4}>
                    <Button
                      w="full"
                      rounded="lg"
                      colorScheme={isSelected ? 'red' : 'blue'}
                      variant={isSelected ? 'outline' : 'solid'}
                      leftIcon={<Icon as={isSelected ? TbX : TbCheck} />}
                      onClick={() =>
                        mutate({ userScheduleId: isSelected ? null : _id })
                      }
                    >
                      {isSelected ? '使用をやめる' : 'インポートせずに使用する'}
                    </Button>
                    <Button
                      w="full"
                      rounded="lg"
                      leftIcon={<Icon as={TbDownload} />}
                      onClick={importModalOnOpen}
                    >
                      インポート
                    </Button>
                  </VStack>
                  <UserScheduleImportModal
                    schedule={{ title, description, schedules, meta, ...rest }}
                    isOpen={importModalOpen}
                    onClose={importModalOnClose}
                  />
                </>
              )}
            </VStack>
          </Collapse>
        </Box>
      </VStack>
    );
  },
);

const TablePeriod = React.memo(
  ({ subjectId }: { subjectId: string | null }) => {
    const { data } = useUserSubject(subjectId ?? '', { enabled: !!subjectId });

    return (
      <Td textStyle="title" fontSize="lg">
        {data?.short_name ?? data?.name ?? '-'}
      </Td>
    );
  },
);

export default Card;
