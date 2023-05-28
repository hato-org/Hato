import React, { RefObject } from 'react';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableProps,
} from '@chakra-ui/react';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import { useUserSubject } from '@/hooks/timetable';

interface TimetableTableProps extends TableProps {
  week: Week;
  day: Day;
  schedules?: UserSchedule['schedules'];
  isLoading?: boolean;
  portalContainerRef?: RefObject<HTMLElement | null>;
  error?: any;
}

const TimetableTable = React.memo(
  ({
    week,
    day,
    schedules,
    isLoading,
    error,
    portalContainerRef,
    ...rest
  }: TimetableTableProps) => {
    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <TableContainer w="100%" {...rest}>
        <Table variant="simple" size="sm" textStyle="title" colorScheme="bg">
          <Thead>
            <Tr>
              <Th>時間</Th>
              <Th>教科名</Th>
              <Th>場所</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: schedules?.[week][day].length ?? 0 }).map(
              (_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Tr key={`${schedules?.[week][day][index]?.subjectId}${index}`}>
                  <Td>{index + 1}</Td>
                  <TablePeriod {...schedules?.[week][day][index]} />
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
);

const TablePeriod = React.memo(
  ({ subjectId }: { subjectId?: string | null }) => {
    const { data } = useUserSubject(
      { id: subjectId ?? '' },
      { enabled: !!subjectId }
    );

    return (
      <>
        <Td textStyle="title" fontSize="lg">
          {data?.name ?? '-'}
        </Td>
        <Td textStyle="title" fontSize="lg">
          {data?.location ?? '-'}
        </Td>
      </>
    );
  }
);

export default TimetableTable;
