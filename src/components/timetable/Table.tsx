import React from 'react';
import { Table } from '@chakra-ui/react';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import { useUserSubject } from '@/services/timetable';
import { HTTPError } from 'ky';

interface TimetableTableProps extends Table.RootProps {
  week: Week;
  day: number;
  schedules?: UserSchedule['schedules'];
  isLoading?: boolean;
  error?: HTTPError;
}

const TimetableTable = React.memo(
  ({
    week,
    day,
    schedules,
    isLoading,
    error,
    ...rest
  }: TimetableTableProps) => {
    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <Table.ScrollArea w="100%">
        <Table.Root
          variant="line"
          size="sm"
          textStyle="title"
          colorScheme="bg"
          {...rest}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>時間</Table.ColumnHeader>
              <Table.ColumnHeader>教科名</Table.ColumnHeader>
              <Table.ColumnHeader>場所</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array.from({ length: schedules?.[week][day].length ?? 0 }).map(
              (_, index) => (
                <Table.Row
                  key={`${schedules?.[week][day][index]?.subjectId}${index}`}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <TablePeriod {...schedules?.[week][day][index]} />
                </Table.Row>
              ),
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    );
  },
);
TimetableTable.displayName = 'TimetableTable';

const TablePeriod = React.memo(
  ({ subjectId }: { subjectId?: string | null }) => {
    const { data } = useUserSubject(subjectId ?? '', { enabled: !!subjectId });

    return (
      <>
        <Table.Cell textStyle="title" fontSize="lg">
          {data?.name ?? '-'}
        </Table.Cell>
        <Table.Cell textStyle="title" fontSize="lg">
          {data?.location ?? '-'}
        </Table.Cell>
      </>
    );
  },
);
TablePeriod.displayName = 'TablePeriod';

export default TimetableTable;
