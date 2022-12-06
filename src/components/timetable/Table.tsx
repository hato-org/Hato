import React, { useState, lazy, Suspense, RefObject } from 'react';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableProps,
  IconButton,
  HStack,
  Text,
  Center,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Heading,
  Icon,
  Portal,
} from '@chakra-ui/react';
import { TbChevronRight, TbPencil } from 'react-icons/tb';
import { format } from 'date-fns/esm';
import Error from '../cards/Error';
import Loading from '../common/Loading';

const TableEditor = lazy(() => import('./TableEditor'));

interface TimetableTableProps extends TableProps {
  date: Date;
  timetable?: DaySchedule[];
  isLoading?: boolean;
  portalContainerRef?: RefObject<HTMLElement | null>;
  error?: any;
}

const TimetableTable = React.memo(
  ({
    date,
    timetable,
    isLoading,
    error,
    portalContainerRef,
    ...rest
  }: TimetableTableProps) => {
    const [selected, setSelected] = useState<Course>();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <TableContainer w="100%" {...rest}>
        <Table variant="simple" size="sm" textStyle="title" colorScheme="bg">
          <Thead>
            <Tr>
              <Th>時間</Th>
              {!!timetable?.length &&
                timetable?.map((courseTimetable) => (
                  <Th key={courseTimetable.meta.course.name}>
                    <HStack spacing={1}>
                      <Text>{courseTimetable.meta.course.name}</Text>
                      <IconButton
                        aria-label="edit"
                        color="description"
                        icon={<TbPencil />}
                        size="xs"
                        variant="ghost"
                        isRound
                        onClick={() => {
                          setSelected(courseTimetable.meta.course.code);
                          onOpen();
                        }}
                      />
                    </HStack>
                    <Suspense>
                      <TableEditor
                        date={date}
                        isOpen={
                          selected === courseTimetable.meta.course.code &&
                          isOpen
                        }
                        onClose={onClose}
                        type={courseTimetable.meta.type}
                        grade={courseTimetable.meta.grade}
                        class={courseTimetable.meta.class}
                        course={courseTimetable.meta.course.code}
                      />
                    </Suspense>
                  </Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {timetable?.length ? (
              Array.from(
                new Array(
                  Math.max(
                    ...timetable.map(
                      (courseTable) => courseTable.timetable.length
                    )
                  )
                ),
                (_, index) => (
                  <Tr key={`${index}-${_}`}>
                    <Td>{index + 1}</Td>
                    {timetable.map((courseTable) => {
                      const period = courseTable.timetable.find(
                        (coursePeriod) =>
                          coursePeriod.start <= index + 1 &&
                          coursePeriod.end >= index + 1
                      );
                      return period ? (
                        <Td key={courseTable.meta.course.name} fontSize="md">
                          <Popover trigger="hover">
                            <PopoverTrigger>
                              <HStack spacing={0}>
                                <Text>{period?.subject?.name ?? '-'}</Text>
                                {period.subject?.description && (
                                  <Text
                                    as="sup"
                                    fontSize="md"
                                    fontWeight="black"
                                    color="blue.500"
                                  >
                                    ･
                                  </Text>
                                )}
                              </HStack>
                            </PopoverTrigger>
                            <Portal containerRef={portalContainerRef}>
                              <PopoverContent
                                shadow="xl"
                                rounded="xl"
                                borderColor="border"
                                bg="popover"
                              >
                                <PopoverBody>
                                  <VStack w="100%" p={2}>
                                    <VStack spacing={1}>
                                      <Heading size="lg">
                                        {period?.subject?.name}
                                      </Heading>
                                      <HStack textStyle="title">
                                        <HStack>
                                          <Text fontSize="3xl">
                                            {period?.start}
                                          </Text>
                                          <Text textStyle="description">
                                            {format(
                                              new Date(period?.startAt),
                                              'HH:mm'
                                            )}
                                          </Text>
                                        </HStack>
                                        <Icon as={TbChevronRight} w={6} h={6} />
                                        <Text fontSize="3xl">
                                          {period?.end}
                                        </Text>
                                        <Text textStyle="description">
                                          {format(
                                            new Date(period?.endAt),
                                            'HH:mm'
                                          )}
                                        </Text>
                                      </HStack>
                                      <Text
                                        whiteSpace="pre-wrap"
                                        textStyle="description"
                                      >
                                        {period.subject?.description}
                                      </Text>
                                    </VStack>
                                  </VStack>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                        </Td>
                      ) : (
                        <Td>-</Td>
                      );
                    })}
                  </Tr>
                )
              )
            ) : (
              <Tr>
                <Td>
                  <Center py={4}>
                    <Text textStyle="description" fontWeight="bold">
                      時間割がありません
                    </Text>
                  </Center>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
);

export default TimetableTable;
