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
import {
  TbPlus,
  TbDots,
  TbFlag,
  TbPencil,
  TbChevronRight,
} from 'react-icons/tb';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Header from '@/components/nav/Header';
import DateSwitcher from '@/components/timetable/DateSwitcher';
import TimetableTable from '@/components/timetable/Table';
import ScienceRoomTableTable from '@/components/scienceroom/Table';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/layout/Card';
import Loading from '@/components/common/Loading';
import { useUser } from '@/hooks/user';
import { useDivision, useUserSchedule } from '@/hooks/timetable';
import Error from '@/components/timetable/Error';
import { overlayAtom } from '@/store/overlay';

const ReportModal = lazy(() => import('@/components/common/ReportModal'));
const Notes = lazy(() => import('@/components/timetable/Notes'));
const AddNoteDrawer = lazy(
  () => import('@/components/timetable/AddNoteDrawer')
);

function Timetable() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: reportOpen,
    onOpen: reportOnOpen,
    onClose: reportOnClose,
  } = useDisclosure();
  const setOverlay = useSetRecoilState(overlayAtom);
  const [tableFocus, setTableFocus] = useState(false);

  const popoverRef = useRef(null);

  const [date, setDate] = useState(new Date());

  const { data: division } = useDivision({ date });
  const { data: userSchedule } = useUserSchedule(
    { id: user.userScheduleId ?? '' },
    { enabled: !!user.userScheduleId }
  );

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
                  icon={<TbPencil />}
                  onClick={() =>
                    setOverlay((currVal) => ({
                      ...currVal,
                      divisionEditor: date,
                    }))
                  }
                >
                  日課を編集
                </MenuItem>
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
                    url={window.location.toString()}
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
          <VStack w="100%" px={4} spacing={8}>
            <VStack w="100%">
              <DateSwitcher
                onPrev={onPrevDay}
                onNext={onNextDay}
                onSelect={onSelectDay}
                date={date}
                px={2}
              />
            </VStack>
            <Card w="100%">
              <VStack w="100%" align="flex-start" p={2} spacing={6}>
                <VStack w="100%" align="flex-start" spacing={4}>
                  <HStack w="100%" as={RouterLink} to="editor">
                    <Heading size="md">日課</Heading>
                    <Spacer />
                    <HStack rounded="lg" color="description" fontWeight="bold">
                      {division ? (
                        <Text>
                          {division.week}週{' '}
                          {division.irregular
                            ? '特編日課'
                            : `${format(setDay(date, division.day), 'E', {
                                locale: ja,
                              })}曜日課`}
                        </Text>
                      ) : (
                        <Text>日課未設定</Text>
                      )}
                      {/* <Icon as={TbPencil} /> */}
                    </HStack>
                    <Icon as={TbChevronRight} />
                  </HStack>
                  {/* eslint-disable no-nested-ternary */}
                  {user.userScheduleId ? (
                    division ? (
                      <TimetableTable
                        schedules={userSchedule?.schedules}
                        week={division?.week}
                        day={division?.day}
                        onTouchStart={onTableTouchStart}
                        onTouchEnd={onTableTouchEnd}
                        overflowX="auto"
                        portalContainerRef={popoverRef}
                      />
                    ) : (
                      <Error type="divisionNotSet" date={date} />
                    )
                  ) : (
                    <Error type="userScheduleNotSet" />
                  )}
                  {/* eslint-enable no-nested-ternary */}
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
                  <Notes
                    type={user.type}
                    grade={user.grade}
                    schoolClass={user.class}
                    date={date}
                  />
                </Suspense>
              </VStack>
            </Card>
            <Card w="100%">
              <VStack w="100%" p={2} align="flex-start" spacing={4}>
                <HStack w="100%">
                  <Heading size="md">理科室割</Heading>
                </HStack>
                <ScienceRoomTableTable
                  date={date}
                  onTouchStart={onTableTouchStart}
                  onTouchEnd={onTableTouchEnd}
                />
              </VStack>
            </Card>
          </VStack>
        </Center>
      </ChakraPullToRefresh>
    </Box>
  );
}

export default Timetable;
