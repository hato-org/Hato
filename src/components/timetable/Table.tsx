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
import React from 'react';
import Error from '../cards/Error';
import Loading from '../common/Loading';

interface TimetableTableProps extends TableProps {
  timetable?: CurrentTimetable[];
  isLoading?: boolean;
  error?: any;
}

const TimetableTable = React.memo(
  ({ timetable, isLoading, error, ...rest }: TimetableTableProps) => {
    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <TableContainer w="100%" {...rest}>
        <Table variant="simple" size="sm" textStyle="title">
          <Thead>
            <Tr>
              <Th>時間</Th>
              {!!timetable?.length &&
                timetable?.map((courseTimetable) => (
                  <Th key={courseTimetable.course.name}>
                    {courseTimetable.course.name}
                  </Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {timetable?.length ? (
              Array.from(
                new Array(
                  Math.max(
                    ...timetable.map(
                      (courseTable) => courseTable.timetable.length
                    )
                  )
                ),
                (_, index) => (
                  <Tr
                    key={`${index}-${_}`}
                    bg={
                      index + 1 === timetable[0].period
                        ? 'blue.50'
                        : 'transparent'
                    }
                    color={index + 1 === timetable[0].period ? 'blue.400' : ''}
                  >
                    <Td>{index + 1}</Td>
                    {timetable.map((courseTable) => (
                      <Td key={courseTable.course.name} fontSize="md">
                        {courseTable.timetable[index]?.name ?? '-'}
                      </Td>
                    ))}
                  </Tr>
                )
              )
            ) : (
              <Tr>
                <Td>
                  <Loading />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
);

export default TimetableTable;
