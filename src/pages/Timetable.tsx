import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
import DivisionEditor from '@/components/timetable/DivisionEditor';

const ReportModal = lazy(() => import('@/components/common/ReportModal'));
const Notes = lazy(() => import('@/components/timetable/Notes'));
const AddNoteDrawer = lazy(
  () => import('@/components/timetable/AddNoteDrawer'),
);

function Timetable() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDivisionEditorOpen,
    onOpen: onDivisionEditorOpen,
    onClose: onDivisionEditorClose,
  } = useDisclosure();
  const {
    isOpen: reportOpen,
    onOpen: reportOnOpen,
    onClose: reportOnClose,
  } = useDisclosure();
  const [tableFocus, setTableFocus] = useState(false);

  const popoverRef = useRef(null);

  const year = Number(searchParams.get('y'));
  const month = Number(searchParams.get('m'));
  const day = Number(searchParams.get('d'));

  const [date, setDate] = useState(
    new Date(year && month && day ? `${year}-${month}-${day}` : Date.now()),
  );

  const { data: division } = useDivision({ date });
  const { data: userSchedule } = useUserSchedule(
    { id: user.userScheduleId ?? '' },
    { enabled: !!user.userScheduleId },
  );

  useEffect(() => {
    searchParams.set('y', date.getFullYear().toString());
    searchParams.set('m', (date.getMonth() + 1).toString());
    searchParams.set('d', date.getDate().toString());
    setSearchParams(searchParams, { replace: true });
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
              <MenuList shadow="lg" rounded="xl">
                <MenuItem
                  textStyle="title"
                  icon={<TbPencil />}
                  onClick={onDivisionEditorOpen}
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
                onPrev={() => setDate(subDays(date, 1))}
                onNext={() => setDate(addDays(date, 1))}
                onSelect={(e) => {
                  if (e.target.valueAsDate) setDate(e.target.valueAsDate);
                }}
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
                        onTouchStart={() => setTableFocus(true)}
                        onTouchEnd={() => setTableFocus(false)}
                        overflowX="auto"
                        portalContainerRef={popoverRef}
                      />
                    ) : (
                      <Error
                        type="divisionNotSet"
                        onOpen={onDivisionEditorOpen}
                      />
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
                  onTouchStart={() => setTableFocus(true)}
                  onTouchEnd={() => setTableFocus(false)}
                />
              </VStack>
            </Card>
          </VStack>
        </Center>
      </ChakraPullToRefresh>
      <DivisionEditor
        date={date}
        isOpen={isDivisionEditorOpen}
        onClose={onDivisionEditorClose}
      />
    </>
  );
}

export default Timetable;
