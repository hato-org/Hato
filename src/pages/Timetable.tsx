import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from 'react';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Icon,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { addDays, format, setDay, subDays } from 'date-fns/esm';
import { ja } from 'date-fns/esm/locale';
import { Helmet } from 'react-helmet-async';
import { TbPlus, TbDots, TbFlag, TbPencil } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/nav/Header';
import DateSwitcher from '@/components/timetable/DateSwitcher';
import GradeClassPicker from '@/components/timetable/GradeClassPicker';
import TimetableTable from '@/components/timetable/Table';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/layout/Card';
import Loading from '@/components/common/Loading';
import { useCourseList } from '@/hooks/info';
import { useUser } from '@/hooks/user';
import { useTimetable } from '@/hooks/timetable';

const ReportModal = lazy(() => import('@/components/common/ReportModal'));
const Notes = lazy(() => import('@/components/timetable/Notes'));
const AddNoteDrawer = lazy(
  () => import('@/components/timetable/AddNoteDrawer')
);
const ScheduleEditor = lazy(
  () => import('@/components/timetable/ScheduleEditor')
);

function Timetable() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isScheduleOpen,
    onOpen: onScheduleOpen,
    onClose: onScheduleClose,
  } = useDisclosure();
  const {
    isOpen: reportOpen,
    onOpen: reportOnOpen,
    onClose: reportOnClose,
  } = useDisclosure();
  const [tableFocus, setTableFocus] = useState(false);

  const popoverRef = useRef(null);

  const [date, setDate] = useState(new Date());
  const [type, setType] = useState(user.type);
  const [grade, setGrade] = useState(user.grade);
  const [schoolClass, setClass] = useState(user.class);

  const { data: courseList } = useCourseList({ type, grade });

  const { data: timetableList } = useTimetable({
    date,
    type,
    grade,
    class: schoolClass,
    course: courseList?.map((courseInfo) => courseInfo.code) ?? [],
  });

  const onPrevDay = useCallback(() => {
    const prevDate = subDays(date, 1);
    searchParams.set('y', String(prevDate.getFullYear()));
    searchParams.set('m', String(prevDate.getMonth() + 1));
    searchParams.set('d', String(prevDate.getDate()));
    setSearchParams(searchParams, { replace: true });
    setDate(prevDate);
  }, [date, searchParams, setSearchParams]);

  const onNextDay = useCallback(() => {
    const nextDate = addDays(date, 1);
    searchParams.set('y', String(nextDate.getFullYear()));
    searchParams.set('m', String(nextDate.getMonth() + 1));
    searchParams.set('d', String(nextDate.getDate()));
    setSearchParams(searchParams, { replace: true });
    setDate(nextDate);
  }, [date, searchParams, setSearchParams]);

  const onSelectDay = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = new Date(e.target.value);
      searchParams.set('y', String(newDate.getFullYear()));
      searchParams.set('m', String(newDate.getMonth() + 1));
      searchParams.set('d', String(newDate.getDate()));
      setSearchParams(searchParams, { replace: true });
      setDate(newDate);
    },
    [searchParams, setSearchParams]
  );

  const onGradeSelect = useCallback((gradeInfo: GradeInfo) => {
    setType(gradeInfo.type);
    setGrade(gradeInfo.grade_num);
  }, []);

  const onClassSelect = useCallback((classInfo: ClassInfo) => {
    setClass(classInfo.class_num);
  }, []);

  const onTableTouchStart = useCallback(() => setTableFocus(true), []);
  const onTableTouchEnd = useCallback(() => setTableFocus(false), []);

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
    <Box>
      <Helmet>
        <title>時間割 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            時間割
          </Heading>
          <Spacer />
          <Box>
            <Menu>
              <MenuButton
                as={IconButton}
                variant="ghost"
                size="lg"
                aria-label="event menu"
                icon={<TbDots />}
                isRound
              />
              <MenuList shadow="lg">
                <MenuItem
                  textStyle="title"
                  icon={<TbFlag />}
                  onClick={reportOnOpen}
                >
                  報告
                </MenuItem>
                <Suspense>
                  <ReportModal
                    isOpen={reportOpen}
                    onClose={reportOnClose}
                    timetable
                    placeholder="例：〇年〇組〇〇コース〇週〇時間目が△△ではなく□□です"
                  />
                </Suspense>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Header>
      <ChakraPullToRefresh
        isPullable={!tableFocus}
        onRefresh={async () => {
          await queryClient.invalidateQueries(['timetable']);
        }}
      >
        <Center w="100%" mb={32} ref={popoverRef}>
          <VStack w="100%" px={4}>
            <DateSwitcher
              onPrev={onPrevDay}
              onNext={onNextDay}
              onSelect={onSelectDay}
              date={date}
              px={2}
            />
            <GradeClassPicker
              onGradeSelect={onGradeSelect}
              onClassSelect={onClassSelect}
              px={2}
            />
            <Card w="100%">
              <VStack w="100%" align="flex-start" p={2} spacing={6}>
                <VStack w="100%" align="flex-start" spacing={4}>
                  <HStack w="100%">
                    <Heading size="md">日課</Heading>
                    <Spacer />
                    <Suspense>
                      <ScheduleEditor
                        date={date}
                        isOpen={isScheduleOpen}
                        onClose={onScheduleClose}
                      />
                    </Suspense>
                    <HStack
                      px={2}
                      layerStyle="button"
                      rounded="lg"
                      color="description"
                      onClick={onScheduleOpen}
                    >
                      <Text fontWeight="bold">
                        {timetableList?.[0]?.schedule.week}週{' '}
                        {timetableList?.[0]?.schedule.irregular
                          ? '特編日課'
                          : `${format(
                              setDay(
                                date,
                                timetableList?.[0]?.schedule.day ??
                                  date.getDay()
                              ),
                              'E',
                              { locale: ja }
                            )}曜日課`}
                      </Text>
                      <Icon as={TbPencil} />
                    </HStack>
                  </HStack>
                  <StackDivider borderWidth="1px" borderColor="border" />
                  <TimetableTable
                    date={date}
                    timetable={timetableList}
                    onTouchStart={onTableTouchStart}
                    onTouchEnd={onTableTouchEnd}
                    overflowX="auto"
                    portalContainerRef={popoverRef}
                  />
                </VStack>
                {/* <StackDivider borderWidth="1px" /> */}
                <HStack w="100%">
                  <Heading size="md">特記事項・備考</Heading>
                  <Spacer />
                  <Suspense>
                    <AddNoteDrawer
                      date={date}
                      isOpen={isOpen}
                      onClose={onClose}
                    />
                  </Suspense>
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
                <Suspense fallback={<Loading />}>
                  <Notes {...{ type, grade, schoolClass }} date={date} />
                </Suspense>
              </VStack>
            </Card>
          </VStack>
        </Center>
      </ChakraPullToRefresh>
    </Box>
  );
}

export default Timetable;
