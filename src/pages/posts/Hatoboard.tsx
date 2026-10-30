import React, { useEffect, useMemo, useRef } from 'react';
import { Tabs, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import CardElement from '@/components/cards';
import Loading from '@/components/common/Loading';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/posts/Card';
import { pinnedPostAtom, postsScrollStateAtom } from '@/store/posts';
import { useHatoboard } from '@/services/posts';
import { queryKeys } from '@/services/queryKeys';

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
    <Tabs.Root
      w="100%"
      fitted
      size="lg"
      value={searchParams.get('tab') ?? '0'}
      onValueChange={(e) => {
        setSearchParams({ tab: e.value });
        setScrollState(undefined);
      }}
      lazyMount
    >
      <Tabs.List
        w="100%"
        position="sticky"
        top={14}
        bg="bg"
        shadow="lg"
        zIndex={5}
      >
        <Tabs.Trigger
          value="0"
          textStyle="title"
          _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
        >
          すべて
        </Tabs.Trigger>
        <Tabs.Trigger
          value="1"
          textStyle="title"
          _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
        >
          校外
        </Tabs.Trigger>
        <Tabs.Trigger
          value="2"
          textStyle="title"
          _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
        >
          校内
        </Tabs.Trigger>
      </Tabs.List>
      <ChakraPullToRefresh
        w="100%"
        pt={4}
        pb={24}
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryKeys.posts.hatoboard(),
            }),
          ]);
        }}
      >
        <Box w="100%" p={0}>
          <Tabs.Content value="0" w="100%" px={4} py={2}>
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
          </Tabs.Content>
          <Tabs.Content value="1" w="100%" px={4} py={2}>
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
          </Tabs.Content>
          <Tabs.Content value="2" w="100%" px={4} py={2}>
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
          </Tabs.Content>
        </Box>
      </ChakraPullToRefresh>
    </Tabs.Root>
  );
});
Hatoboard.displayName = 'Hatoboard';

export default Hatoboard;
