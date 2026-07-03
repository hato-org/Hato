import React from 'react';
import { Center, Table, Text } from '@chakra-ui/react';
import { useRoomTable } from '@/services/scienceroom';
import Loading from '../common/Loading';
import Error from '../cards/Error';

interface RoomTableTableProps extends Table.RootProps {
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
      <Table.ScrollArea w="100%">
        <Table.Root
          variant="line"
          size="sm"
          textStyle="title"
          colorPalette="bg"
          {...rest}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>時間</Table.ColumnHeader>
              {data.roomTable.map((room) => (
                <Table.ColumnHeader key={room.name}>
                  <Text>{room.name}</Text>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.roomTable.some((room) => !!room.table.length) ? (
              Array.from({
                length: Math.max(
                  ...data.roomTable.map((room) => room.table.length),
                ),
              }).map((_, index) => (
                <Table.Row key={`${index}-${_}`}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  {data.roomTable.map((room) => (
                    <Table.Cell key={room.name}>
                      <Text whiteSpace="pre" textAlign="center">
                        {room.table[index] !== '\n'
                          ? room.table[index] || '-'
                          : '-'}
                      </Text>
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell>
                  <Center py={4}>
                    <Text textStyle="description" fontWeight="bold">
                      データがありません
                    </Text>
                  </Center>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    );
  },
);
ScienceRoomTableTable.displayName = 'ScienceRoomTableTable';

export default ScienceRoomTableTable;
