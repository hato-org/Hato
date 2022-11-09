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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight, TbPoint } from 'react-icons/tb';
import TimetableTable from '../timetable/Table';
import { useCurrentTable, useNotes } from '@/hooks/timetable';

function Timetable() {
  const { data, isLoading, error } = useCurrentTable();
  const { data: notes } = useNotes({ date: new Date() });

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
          <Text textStyle="title" color="description">
            {data?.week}週 {data?.period}時間目
          </Text>
          <Icon as={TbChevronRight} w={5} h={5} />
        </HStack>
      </LinkBox>
      <TimetableTable
        p={2}
        timetable={data ? [data] : []}
        isLoading={isLoading}
        error={error}
      />
    </VStack>
  );
}

export default Timetable;
