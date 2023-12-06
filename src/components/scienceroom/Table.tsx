import React from 'react';
import {
  Center,
  Table,
  TableContainer,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useRoomTable } from '@/services/scienceroom';
import Loading from '../common/Loading';
import Error from '../cards/Error';

interface RoomTableTableProps extends TableProps {
  date: Date;
}

const ScienceRoomTableTable = React.memo(
  ({ date, ...rest }: RoomTableTableProps) => {
    const { data, status, error } = useRoomTable({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });

    if (status === 'pending') return <Loading />;
    if (status === 'error') return <Error error={error} />;

    return (
      <TableContainer w="100%" {...rest}>
        <Table variant="simple" size="sm" textStyle="title" colorScheme="bg">
          <Thead>
            <Tr>
              <Th>時間</Th>
              {data.roomTable.map((room) => (
                <Th key={room.name}>
                  <Text>{room.name}</Text>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.roomTable.some((room) => !!room.table.length) ? (
              Array.from({
                length: Math.max(
                  ...data.roomTable.map((room) => room.table.length),
                ),
              }).map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Tr key={`${index}-${_}`}>
                  <Td>{index + 1}</Td>
                  {data.roomTable.map((room) => (
                    <Td>
                      <Text whiteSpace="pre" textAlign="center">
                        {room.table[index] !== '\n'
                          ? room.table[index] || '-'
                          : '-'}
                      </Text>
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td>
                  <Center py={4}>
                    <Text textStyle="description" fontWeight="bold">
                      データがありません
                    </Text>
                  </Center>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    );
  },
);

export default ScienceRoomTableTable;
