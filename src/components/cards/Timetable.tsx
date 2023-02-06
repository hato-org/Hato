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
import { format, setDay, startOfDay } from 'date-fns/esm';
import { ja } from 'date-fns/locale';
import TimetableTable from '../timetable/Table';
import { useTimetable, useNotes } from '@/hooks/timetable';
import Transit from './Transit';
import { useUser } from '@/hooks/user';

function Timetable() {
  const date = new Date();
  const { data: user } = useUser();
  const { data, isLoading, error } = useTimetable({
    date,
    type: user.type,
    grade: user.grade,
    class: user.class,
    course: [user.course],
  });
  const { data: notes } = useNotes({ date });

  if (
    data &&
    new Date(data?.[0].timetable.at(-1)?.endAt ?? startOfDay(date)) < date
  )
    return <Transit />;

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
              {data?.[0].schedule.week}週{' '}
              {format(
                setDay(date, data?.[0].schedule.day ?? date.getDay()),
                'E',
                {
                  locale: ja,
                }
              )}
              曜日課
            </Text>
          </Skeleton>
          <Icon as={TbChevronRight} boxSize={5} />
        </HStack>
      </LinkBox>
      <TimetableTable
        p={2}
        date={date}
        timetable={data}
        isLoading={isLoading}
        error={error}
      />
    </VStack>
  );
}

export default Timetable;
