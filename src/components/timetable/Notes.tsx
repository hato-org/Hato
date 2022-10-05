import {
  VStack,
  Text,
  StackProps,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '../../modules/client';
import Error from '../cards/Error';
import Loading from '../common/Loading';

interface NotesProps extends StackProps {
  year: number;
  month: number;
  day: number;
}

function Notes({ year, month, day, ...rest }: NotesProps) {
  const { client } = useClient();

  const { data, isLoading, error } = useQuery<Note[], AxiosError>(
    ['timetable', 'note', { year, month, day }],
    async () =>
      (await client.get('/timetable/note', { params: { year, month, day } }))
        .data
  );

  if (isLoading) return <Loading />;

  if (error) return <Error error={error} />;

  return (
    <VStack w="100%" {...rest}>
      {/* eslint-disable no-nested-ternary */}
      {data?.length ? (
        <UnorderedList w="100%" px={4}>
          {data.map((note) => (
            <ListItem whiteSpace="pre-wrap">
              <Text textStyle="title">{note.message}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text textStyle="description" fontWeight="bold">
          特にありません
        </Text>
      )}
      {/* eslint-enable no-nested-ternary */}
    </VStack>
  );
}

export default Notes;
