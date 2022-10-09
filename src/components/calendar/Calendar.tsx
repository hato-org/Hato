import {
  VStack,
  HStack,
  Text,
  Box,
  StackProps,
  IconButton,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSaturday,
  isSunday,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns/esm';
import { useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { useClient } from '../../modules/client';
import { MotionCenter } from '../motion';

interface CalendarProps extends StackProps {
  year: number;
  month: number;
}

function Calendar({ year, month, ...rest }: CalendarProps) {
  const { client } = useClient();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDate = new Date();

  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const [date, setDate] = useState(
    new Date(
      year || currentDate.getFullYear(),
      month === 0 ? currentDate.getMonth() : month - 1
    )
  );
  const sundays = eachWeekOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
  const days = sundays.map((sunday) =>
    eachDayOfInterval({
      start: sunday,
      end: endOfWeek(sunday),
    })
  );

  const { data: events } = useQuery<Event[], AxiosError>(
    [
      'calendar',
      'events',
      { month: date.getMonth() + 1, year: date.getFullYear() },
    ],
    async () =>
      (
        await client.get('/calendar/event', {
          params: { y: date.getFullYear(), m: date.getMonth() + 1 },
        })
      ).data,
    {
      cacheTime: Infinity,
      onSuccess: (data) => {
        data.forEach((event) => {
          queryClient.setQueryData(['calendar', 'event', event._id], event);
        });
      },
      onError: (error) => {
        toast({
          position: 'top-right',
          variant: 'left-accent',
          status: 'error',
          title: 'データを取得できませんでした',
          description: error.message,
        });
      },
    }
  );

  return (
    <VStack w="100%" spacing={4} {...rest}>
      <MonthSwitcher
        date={date}
        onNext={() => {
          const nextDate = addMonths(date, 1);
          searchParams.set('y', String(nextDate.getFullYear()));
          searchParams.set('m', String(nextDate.getMonth() + 1));
          setSearchParams(searchParams, { replace: true });
          setDate(addMonths(date, 1));
        }}
        onPrev={() => {
          const prevDate = subMonths(date, 1);
          searchParams.set('y', String(prevDate.getFullYear()));
          searchParams.set('m', String(prevDate.getMonth() + 1));
          setSearchParams(searchParams, { replace: true });
          setDate(subMonths(date, 1));
        }}
      />
      <MotionCenter
        w="100%"
        h="80vh"
        p={1}
        // drag="x"
        // dragSnapToOrigin
        // onDragEnd={(event: any, info: any) => console.log(event, info)}
        rounded="xl"
        shadow="xl"
        border="1px solid"
        borderColor="gray.100"
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
                  h="100%"
                  bg={isToday(day) ? 'gray.50' : ''}
                >
                  <Text
                    color={
                      /* eslint-disable no-nested-ternary */
                      isSameMonth(date, day)
                        ? isSaturday(day)
                          ? 'blue.400'
                          : isSunday(day)
                          ? 'red.400'
                          : 'gray.600'
                        : 'gray.400'
                      /* eslint-enable no-nested-ternary */
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
                            day < new Date(event.endAt))
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
                          rounded="sm"
                          bg={
                            /* eslint-disable no-nested-ternary */
                            event.external
                              ? event.isAllDay
                                ? 'green.400'
                                : 'green.50'
                              : event.isAllDay
                              ? 'blue.400'
                              : 'blue.50'
                            /* eslint-enable no-nested-ternary */
                          }
                          color={
                            /* eslint-disable no-nested-ternary */
                            event.external
                              ? event.isAllDay
                                ? 'white'
                                : 'green.400'
                              : event.isAllDay
                              ? 'white'
                              : 'blue.400'
                            /* eslint-enable no-nested-ternary */
                          }
                          as={RouterLink}
                          to={`/events/${event._id}`}
                        >
                          <Text
                            noOfLines={1}
                            fontSize="xx-small"
                            fontWeight="bold"
                            textAlign="center"
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
      </MotionCenter>
    </VStack>
  );
}

interface MonthSwitcherProps {
  date: Date;
  onNext: () => void;
  onPrev: () => void;
}

function MonthSwitcher({ date, onNext, onPrev }: MonthSwitcherProps) {
  return (
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
  );
}

export default Calendar;
