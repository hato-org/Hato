import {
  VStack,
  HStack,
  Text,
  Box,
  StackProps,
  IconButton,
  Divider,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSaturday,
  isSunday,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns/esm';
import React, { useMemo } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import Card from '../layout/Card';
import { useEvents } from '@/services/calendar';

interface CalendarProps extends StackProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Calendar = React.memo(
  ({ year, month, onPrevMonth, onNextMonth, ...rest }: CalendarProps) => {
    const date = useMemo(() => new Date(year, month - 1, 1), [year, month]);

    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

    const sundays = eachWeekOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    });
    const days = sundays.map((sunday) =>
      eachDayOfInterval({
        start: sunday,
        end: endOfWeek(sunday),
      }),
    );

    const { data: events } = useEvents({ year, month });

    return (
      <VStack w="100%" spacing={4} {...rest}>
        <MonthSwitcher date={date} onNext={onNextMonth} onPrev={onPrevMonth} />
        <Card w="100%" p={0}>
          <Center
            w="100%"
            p={1}
            // drag="x"
            // dragSnapToOrigin
            // onDragEnd={(event: any, info: any) => console.log(event, info)}
          >
            <VStack w="100%" h="100%" spacing={1} divider={<Divider />}>
              <HStack w="100%" spacing={0}>
                {dayOfWeek.map((day) => (
                  <Text
                    key={day}
                    w="100%"
                    textAlign="center"
                    textStyle="description"
                    fontSize="xs"
                  >
                    {day}
                  </Text>
                ))}
              </HStack>
              {days.map((week) => (
                <HStack key={week.toString()} w="100%" h="100%" spacing={0}>
                  {week.map((day) => (
                    <VStack
                      key={day.toString()}
                      flex={1}
                      minW={0}
                      h={{ base: 24, md: 32 }}
                      rounded="md"
                      bg={isToday(day) ? 'active' : ''}
                    >
                      <Text
                        color={
                          isSameMonth(date, day)
                            ? isSaturday(day)
                              ? 'blue.400'
                              : isSunday(day)
                                ? 'red.400'
                                : 'title'
                            : 'description'
                        }
                        textStyle="title"
                        fontSize="xs"
                      >
                        {day.getDate()}
                      </Text>
                      <VStack spacing="2px" w="100%" px="1px" overflowY="auto">
                        {events
                          ?.filter(
                            (event) =>
                              isSameDay(new Date(event.startAt), day) ||
                              isSameDay(new Date(event.endAt), day) ||
                              (new Date(event.startAt) < day &&
                                day < new Date(event.endAt)),
                          )
                          .sort((prev, next) => {
                            if (!prev.isAllDay && next.isAllDay) {
                              return 1;
                            }
                            if (prev.isAllDay && !next.isAllDay) {
                              return -1;
                            }
                            return 0;
                          })
                          .sort((prev, next) => {
                            if (!prev.external && next.external) {
                              return 1;
                            }
                            if (prev.external && !next.external) {
                              return -1;
                            }
                            return 0;
                          })
                          .map((event) => (
                            <Box
                              key={event._id}
                              w="100%"
                              rounded={{ base: 'sm', md: 4 }}
                              px={{ base: 0, md: '2px' }}
                              py={{ base: 0, md: '1px' }}
                              bg={
                                event.external
                                  ? event.isAllDay
                                    ? 'green.400'
                                    : 'green.50'
                                  : event.isAllDay
                                    ? 'blue.400'
                                    : 'blue.50'
                              }
                              color={
                                event.external
                                  ? event.isAllDay
                                    ? 'white'
                                    : 'green.400'
                                  : event.isAllDay
                                    ? 'white'
                                    : 'blue.400'
                              }
                              _hover={{
                                bg: event.external
                                  ? event.isAllDay
                                    ? 'green.500'
                                    : 'green.100'
                                  : event.isAllDay
                                    ? 'blue.500'
                                    : 'blue.100',
                              }}
                              transition="all .2s ease"
                              as={RouterLink}
                              to={`/events/${event._id}`}
                            >
                              <Text
                                noOfLines={1}
                                fontSize={{ base: 'xx-small', md: 'xs' }}
                                fontWeight="bold"
                                textAlign="center"
                                wordBreak="break-all"
                              >
                                {event.title}
                              </Text>
                            </Box>
                          ))}
                      </VStack>
                    </VStack>
                  ))}
                </HStack>
              ))}
            </VStack>
          </Center>
        </Card>
      </VStack>
    );
  },
);

interface MonthSwitcherProps {
  date: Date;
  onNext: () => void;
  onPrev: () => void;
}

const MonthSwitcher = React.memo(
  ({ date, onNext, onPrev }: MonthSwitcherProps) => (
    <HStack p={2} w="100%" rounded="xl" justify="space-between">
      <IconButton
        aria-label="previous month"
        icon={<TbChevronLeft />}
        onClick={onPrev}
        isRound
        variant="ghost"
      />
      <Text textStyle="title">{format(date, 'yyyy年M月')}</Text>
      <IconButton
        aria-label="next month"
        icon={<TbChevronRight />}
        onClick={onNext}
        isRound
        variant="ghost"
      />
    </HStack>
  ),
);

export default Calendar;
