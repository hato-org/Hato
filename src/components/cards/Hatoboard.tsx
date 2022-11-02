import {
  Center,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TbChevronRight } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';
import { useClient } from '@/modules/client';
import Loading from '../common/Loading';
import Card from '../posts/Card';
import Error from './Error';

function Hatoboard() {
  const { client } = useClient();

  const { data, isLoading, error } = useQuery<Post[], AxiosError>(
    ['posts', 'hatoboard'],
    async () => (await client.get('/post')).data,
    { cacheTime: Infinity }
  );

  return (
    <VStack w="100%" spacing={4}>
      <HStack w="100%" pt={2} pl={2} as={RouterLink} to="/posts/hatoboard">
        <Heading as="h2" size="md">
          はとボード
        </Heading>
        <Spacer />
        <Icon as={TbChevronRight} w={5} h={5} />
      </HStack>
      {/* eslint-disable no-nested-ternary */}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Error error={error} />
      ) : (
        <VStack w="100%" align="flex-start" spacing={0}>
          <Text pl={2} textStyle="title" fontSize="lg">
            最新の投稿
          </Text>
          {data.length ? (
            <Card {...data[0]} />
          ) : (
            <Center w="100%" pt={4}>
              <Text textStyle="description" fontWeight="bold">
                投稿がありません
              </Text>
            </Center>
          )}
        </VStack>
      )}
      {/* eslint-enable no-nested-ternary */}
    </VStack>
  );
}

export default Hatoboard;
