import {
  Center,
  Heading,
  HStack,
  IconButton,
  Spacer,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useQueries } from '@tanstack/react-query';
import { addDays, format, startOfDay, subDays } from 'date-fns/esm';
import { ja } from 'date-fns/esm/locale';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { TbPlus } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import BottomNavbar from '@/components/nav/BottomNavbar';
import Header from '@/components/nav/Header';
import AddNoteDrawer from '@/components/timetable/AddNoteDrawer';
import DateSwitcher from '@/components/timetable/DateSwitcher';
import GradeClassPicker from '@/components/timetable/GradeClassPicker';
import Notes from '@/components/timetable/Notes';
import TimetableTable from '@/components/timetable/Table';
import { useCourseList } from '@/hooks/info';
import { useUser } from '@/hooks/user';
import { useClient } from '@/modules/client';

function Timetable() {
  const { data: user } = useUser();
  const { client } = useClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [date, setDate] = useState(new Date());
  const [type, setType] = useState(user.type);
  const [grade, setGrade] = useState(user.grade);
  const [schoolClass, setClass] = useState(user.class);
  const dateParams = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  const { data: courseList } = useCourseList({ type, grade });

  const timetableList = useQueries({
    queries:
      courseList?.map(({ code }) => {
        const params = {
          ...dateParams,
          type,
          grade,
          class: schoolClass,
          course: code,
        };

        return {
          queryKey: ['timetable', params],
          queryFn: async () =>
            (await client.get<CurrentTimetable>('/timetable', { params })).data,
        };
      }) ?? [],
  });

  useEffect(() => {
    if (
      searchParams.has('y') &&
      searchParams.has('m') &&
      searchParams.has('d')
    ) {
      setDate(
        new Date(
          Number(searchParams.get('y')),
          Number(searchParams.get('m')) - 1,
          Number(searchParams.get('d'))
        )
      );
    } else {
      searchParams.set('y', String(date.getFullYear()));
      searchParams.set('m', String(date.getMonth() + 1));
      searchParams.set('d', String(date.getDate()));
      setSearchParams(searchParams, {
        replace: true,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>時間割 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%" px={2}>
          <Heading size="md" ml={4} py={4}>
            時間割
          </Heading>
        </HStack>
      </Header>
      <Center w="100%" mb={32}>
        <VStack w="100%" px={4}>
          <DateSwitcher
            onPrev={() => {
              const prevDate = subDays(date, 1);
              searchParams.set('y', String(prevDate.getFullYear()));
              searchParams.set('m', String(prevDate.getMonth() + 1));
              searchParams.set('d', String(prevDate.getDate()));
              setSearchParams(searchParams, { replace: true });
              setDate(prevDate);
            }}
            onNext={() => {
              const nextDate = addDays(date, 1);
              searchParams.set('y', String(nextDate.getFullYear()));
              searchParams.set('m', String(nextDate.getMonth() + 1));
              searchParams.set('d', String(nextDate.getDate()));
              setSearchParams(searchParams, { replace: true });
              setDate(nextDate);
            }}
            onSelect={(e) => {
              const newDate = new Date(e.target.value);
              searchParams.set('y', String(newDate.getFullYear()));
              searchParams.set('m', String(newDate.getMonth() + 1));
              searchParams.set('d', String(newDate.getDate()));
              setSearchParams(searchParams, { replace: true });
              setDate(newDate);
            }}
            date={date}
            px={2}
          />
          <GradeClassPicker
            onGradeSelect={(gradeInfo) => {
              setType(gradeInfo.type);
              setGrade(gradeInfo.grade_num);
            }}
            onClassSelect={(classInfo) => {
              setClass(classInfo.class_num);
            }}
            px={2}
          />
          <VStack
            rounded="xl"
            shadow="xl"
            border="1px solid"
            borderColor="gray.100"
            w="100%"
            align="flex-start"
            p={6}
            spacing={6}
          >
            <VStack w="100%" overflowX="auto" align="flex-start" spacing={4}>
              <HStack w="100%">
                <Heading size="md">日課</Heading>
                <Spacer />
                <Text textStyle="description" fontSize="lg" fontWeight="bold">
                  {timetableList?.[0]?.data?.week}週{' '}
                  {format(date, 'eeee', { locale: ja })}
                </Text>
              </HStack>
              <StackDivider borderWidth="1px" borderColor="gray.100" />
              <TimetableTable
                timetable={timetableList
                  .map((timetable) => timetable.data)
                  .filter(
                    (timetable): timetable is CurrentTimetable => !!timetable
                  )}
              />
            </VStack>
            {/* <StackDivider borderWidth="1px" /> */}
            <HStack w="100%">
              <Heading size="md">特記事項・備考</Heading>
              <Spacer />
              <AddNoteDrawer
                date={startOfDay(
                  new Date(
                    dateParams.year,
                    dateParams.month - 1,
                    dateParams.day
                  )
                )}
                isOpen={isOpen}
                onClose={onClose}
              />
              <IconButton
                colorScheme="blue"
                color="blue.400"
                aria-label="Add note"
                icon={<TbPlus />}
                variant="ghost"
                isRound
                onClick={onOpen}
              />
            </HStack>
            <Notes {...{ type, grade, schoolClass }} {...dateParams} />
          </VStack>
        </VStack>
      </Center>
      <BottomNavbar />
    </>
  );
}

export default Timetable;
