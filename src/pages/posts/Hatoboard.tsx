import React, { useEffect, useMemo, useRef } from 'react';
import { Tabs, TabList, Tab, TabPanel, TabPanels, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import CardElement from '@/components/cards';
import Loading from '@/components/common/Loading';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/posts/Card';
import { pinnedPostAtom, postsScrollStateAtom } from '@/store/posts';
import { useHatoboard } from '@/services/posts';

const Hatoboard = React.memo(() => {
  const queryClient = useQueryClient();
  const pinned = useAtomValue(pinnedPostAtom);
  const [scrollState, setScrollState] = useAtom(postsScrollStateAtom);

  const [searchParams, setSearchParams] = useSearchParams();
  const { data, error, status } = useHatoboard();

  const allPostsRef = useRef<VirtuosoHandle>(null);
  const publicPostsRef = useRef<VirtuosoHandle>(null);
  const privatePostsRef = useRef<VirtuosoHandle>(null);

  const pinnedPosts = useMemo(
    () =>
      data?.filter((post) => pinned.some((postId) => post._id === postId)) ??
      [],
    [pinned, data],
  );

  const unpinnedPosts = useMemo(
    () =>
      data?.filter((post) => pinned.every((postId) => post._id !== postId)) ??
      [],
    [pinned, data],
  );

  const privatePosts = useMemo(
    () =>
      data?.filter((post) => post.tags.some((tag) => tag.value === 'private')),
    [data],
  );

  const publicPosts = useMemo(
    () =>
      data?.filter((post) => post.tags.some((tag) => tag.value === 'public')),
    [data],
  );

  useEffect(() => {
    if (!searchParams.has('tab')) {
      setSearchParams(
        {
          tab: '0',
        },
        {
          replace: true,
        },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <CardElement.Error error={error} />;

  return (
    <Tabs
      w="100%"
      isFitted
      size="lg"
      defaultIndex={Number(searchParams.get('tab'))}
      onChange={(index) => {
        setSearchParams({ tab: index.toString() });
        setScrollState(undefined);
      }}
      isLazy
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
            queryClient.invalidateQueries({ queryKey: ['posts', 'hatoboard'] }),
          ]);
        }}
      >
        <TabPanels w="100%" p={0}>
          <TabPanel w="100%" px={4} py={2}>
            <Virtuoso
              useWindowScroll
              ref={allPostsRef}
              data={[...pinnedPosts, ...unpinnedPosts]}
              itemContent={(index, post) => (
                <Box py={2}>
                  <Card {...post} key={post._id} />
                </Box>
              )}
              itemsRendered={() =>
                allPostsRef.current?.getState((state) => setScrollState(state))
              }
              restoreStateFrom={scrollState}
            />
          </TabPanel>
          <TabPanel w="100%" px={4} py={2}>
            <Virtuoso
              useWindowScroll
              ref={publicPostsRef}
              data={publicPosts}
              itemContent={(index, post) => (
                <Box py={2}>
                  <Card {...post} key={post._id} />
                </Box>
              )}
              itemsRendered={() =>
                publicPostsRef.current?.getState((state) =>
                  setScrollState(state),
                )
              }
              restoreStateFrom={scrollState}
            />
          </TabPanel>
          <TabPanel w="100%" px={4} py={2}>
            <Virtuoso
              useWindowScroll
              ref={privatePostsRef}
              data={privatePosts}
              itemContent={(index, post) => (
                <Box py={2}>
                  <Card {...post} key={post._id} />
                </Box>
              )}
              itemsRendered={() =>
                privatePostsRef.current?.getState((state) =>
                  setScrollState(state),
                )
              }
              restoreStateFrom={scrollState}
            />
          </TabPanel>
        </TabPanels>
      </ChakraPullToRefresh>
    </Tabs>
  );
});

export default Hatoboard;
