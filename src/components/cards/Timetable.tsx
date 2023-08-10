import {
  Heading,
  VStack,
  HStack,
  Icon,
  Spacer,
  Text,
  LinkBox,
  Tooltip,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight, TbPoint } from 'react-icons/tb';
import { format, setDay } from 'date-fns/esm';
import { ja } from 'date-fns/locale';
import TimetableTable from '../timetable/Table';
import { useUserSchedule, useNotes, useDivision } from '@/hooks/timetable';
import { useUser } from '@/hooks/user';
import Error from '../timetable/Error';
import Loading from '../common/Loading';

function Timetable() {
  const date = new Date();
  const { data: user } = useUser();
  const { data, isLoading: userScheduleLoading } = useUserSchedule(
    { id: user.userScheduleId ?? '' },
    { enabled: !!user.userScheduleId }
  );
  const { data: division, isLoading, error } = useDivision({ date });
  const { data: notes } = useNotes({ date });

  return (
    <VStack w="100%" spacing={4}>
      <LinkBox w="100%" as={RouterLink} to="/timetable">
        <HStack w="100%" pt={2} pl={2}>
          <Heading as="h2" size="md">
            時間割
          </Heading>
          <Spacer />
          {notes?.length && (
            <Tooltip
              label={`備考・特記事項が${notes?.length}件あります`}
              placement="bottom"
            >
              <Flex as="span" align="center">
                <Icon as={TbPoint} color="blue.500" w={5} h={5} />
              </Flex>
            </Tooltip>
          )}
          <Skeleton rounded="md" isLoaded={!isLoading}>
            <Text textStyle="title" color="description">
              {division
                ? `${division.week}週 ${format(
                    setDay(date, division.day),
                    'E',
                    {
                      locale: ja,
                    }
                  )}曜日課`
                : '日課未設定'}
            </Text>
          </Skeleton>
          <Icon as={TbChevronRight} boxSize={5} />
        </HStack>
      </LinkBox>
      {/* eslint-disable no-nested-ternary */}
      {isLoading || userScheduleLoading ? (
        <Loading />
      ) : user.userScheduleId ? (
        division ? (
          <TimetableTable
            p={2}
            week={division?.week}
            day={division?.day}
            schedules={data?.schedules}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <Error type="divisionNotSet" date={date} />
        )
      ) : (
        <Error type="userScheduleNotSet" />
      )}
      {/* eslint-enable no-nested-ternary */}
    </VStack>
  );
}

export default Timetable;
