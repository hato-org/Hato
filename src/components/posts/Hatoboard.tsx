import React, { useEffect, useMemo } from 'react';
import { Tabs, TabList, Tab, TabPanel, TabPanels, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Virtuoso } from 'react-virtuoso';
import CardElement from '../cards';
import Loading from '../common/Loading';
import ChakraPullToRefresh from '../layout/PullToRefresh';
import Card from './Card';
import { pinnedPostAtom, postsScrollIndexAtom } from '@/store/posts';
import { useHatoboard } from '@/hooks/posts';

const Hatoboard = React.memo(() => {
  const queryClient = useQueryClient();
  const pinned = useRecoilValue(pinnedPostAtom);
  const [startIndex, setStartIndex] = useRecoilState(postsScrollIndexAtom);

  const [searchParams, setSearchParams] = useSearchParams();
  const { data, error, isLoading } = useHatoboard();

  const pinnedPosts = useMemo(
    () =>
      data?.filter((post) => pinned.some((postId) => post._id === postId)) ??
      [],
    [pinned, data]
  );

  const unpinnedPosts = useMemo(
    () =>
      data?.filter((post) => pinned.every((postId) => post._id !== postId)) ??
      [],
    [pinned, data]
  );

  const privatePosts = useMemo(
    () =>
      data?.filter((post) => post.tags.some((tag) => tag.value === 'private')),
    [data]
  );

  const publicPosts = useMemo(
    () =>
      data?.filter((post) => post.tags.some((tag) => tag.value === 'public')),
    [data]
  );

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

  if (isLoading) return <Loading />;
  if (error) return <CardElement.Error error={error} />;

  return (
    <Tabs
      w="100%"
      isFitted
      size="lg"
      defaultIndex={Number(searchParams.get('tab'))}
      onChange={(index) => {
        setSearchParams({ tab: index.toString() });
        setStartIndex(0);
        window.scrollTo({
          top: 0,
        });
      }}
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
        pb={24}
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries(['posts', 'hatoboard']),
          ]);
        }}
      >
        <TabPanels w="100%" p={0}>
          <TabPanel w="100%" px={4} py={2}>
            <Virtuoso
              useWindowScroll
              data={[...pinnedPosts, ...unpinnedPosts]}
              itemContent={(index, post) => (
                <Box py={2}>
                  <Card {...post} key={post._id} />
                </Box>
              )}
              rangeChanged={(range) => setStartIndex(range.startIndex)}
              initialTopMostItemIndex={startIndex}
            />
          </TabPanel>
          <TabPanel w="100%" px={4} py={2}>
            <Virtuoso
              useWindowScroll
              data={publicPosts}
              itemContent={(index, post) => (
                <Box py={2}>
                  <Card {...post} key={post._id} />
                </Box>
              )}
              rangeChanged={(range) => setStartIndex(range.startIndex)}
              initialTopMostItemIndex={startIndex}
            />
          </TabPanel>
          <TabPanel w="100%" px={4} py={2}>
            <Virtuoso
              useWindowScroll
              data={privatePosts}
              itemContent={(index, post) => (
                <Box py={2}>
                  <Card {...post} key={post._id} />
                </Box>
              )}
              rangeChanged={(range) => setStartIndex(range.startIndex)}
              initialTopMostItemIndex={startIndex}
            />
          </TabPanel>
        </TabPanels>
      </ChakraPullToRefresh>
    </Tabs>
  );
});

export default Hatoboard;
