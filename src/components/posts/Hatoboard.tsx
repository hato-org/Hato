import { useEffect } from 'react';
import {
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useClient } from '@/modules/client';
import CardElement from '../cards';
import Loading from '../common/Loading';
import ChakraPullToRefresh from '../layout/PullToRefresh';
import Card from './Card';

function Hatoboard() {
  const { client } = useClient();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has('tab')) {
      setSearchParams(
        {
          tab: '0',
        },
        {
          replace: true,
        }
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, error, isLoading } = useQuery<Post[], AxiosError>(
    ['posts', 'hatoboard'],
    async () => (await client.get('/post')).data,
    {
      cacheTime: Infinity,
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <CardElement.Error error={error} />;

  return (
    <Tabs
      w="100%"
      isFitted
      size="lg"
      defaultIndex={Number(searchParams.get('tab'))}
      onChange={(index) => setSearchParams({ tab: index.toString() })}
    >
      <TabList
        w="100%"
        position="sticky"
        top={14}
        bg="bg"
        shadow="lg"
        zIndex={5}
      >
        <Tab
          textStyle="title"
          _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
        >
          すべて
        </Tab>
        <Tab
          textStyle="title"
          _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
        >
          校外
        </Tab>
        <Tab
          textStyle="title"
          _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
        >
          校内
        </Tab>
      </TabList>
      <ChakraPullToRefresh
        w="100%"
        pt={4}
        pb={8}
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries(['posts', 'hatoboard']),
          ]);
        }}
      >
        <TabPanels w="100%" p={0}>
          <TabPanel w="100%" p={0}>
            <VStack p={4} spacing={4} w="100%">
              {data?.map((post) => (
                <Card {...post} key={post._id} />
              ))}
            </VStack>
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <VStack p={4} spacing={4} w="100%">
              {data
                ?.filter((post) =>
                  post.tags.some((tag) => tag.value === 'public')
                )
                .map((post) => (
                  <Card {...post} key={post._id} />
                ))}
            </VStack>
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <VStack p={4} spacing={4} w="100%">
              {data
                ?.filter((post) =>
                  post.tags.some((tag) => tag.value === 'private')
                )
                .map((post) => (
                  <Card {...post} key={post._id} />
                ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </ChakraPullToRefresh>
    </Tabs>
  );
}

export default Hatoboard;
