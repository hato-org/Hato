import { Heading, VStack, HStack, Icon, Spacer, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight } from 'react-icons/tb';
import TimetableTable from '../timetable/Table';
import { useCurrentTable } from '@/hooks/timetable';

function Timetable() {
  const { data, isLoading, error } = useCurrentTable();

  return (
    <VStack w="100%" spacing={4}>
      <HStack w="100%" pt={2} pl={2} as={RouterLink} to="/timetable">
        <Heading as="h2" size="md">
          時間割
        </Heading>
        <Spacer />
        <Text textStyle="title" color="description">
          {data?.week}週 {data?.period}時間目
        </Text>
        <Icon as={TbChevronRight} w={5} h={5} />
      </HStack>
      <TimetableTable
        timetable={data ? [data] : []}
        isLoading={isLoading}
        error={error}
      />
    </VStack>
  );
}

export default Timetable;
