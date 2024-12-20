import { useRef } from 'react';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useAtom } from 'jotai';
import { TbExternalLink } from 'react-icons/tb';
import BackButton from '@/components/layout/BackButton';
import Header from '@/components/nav/Header';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import CourseHeader from '@/components/classroom/CourseHeader';
import { useGCCourseInfo, useGCCourseTimeline } from '@/services/classroom';
import Post from '@/components/classroom/Post';
import Footer from '@/components/classroom/LoadingFooter';
import { GCScrollIndexAtomFamily } from '@/store/classroom';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';

export default function ClassroomCourse() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data } = useGCCourseInfo(id);
  const {
    data: timeline,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGCCourseTimeline(id);
  const scrollRef = useRef<VirtuosoHandle>(null);
  const [scrollState, setScrollState] = useAtom(GCScrollIndexAtomFamily(id));

  return (
    <>
      <Helmet>
        <title>
          {data?.name} - {import.meta.env.VITE_APP_NAME}
        </title>
      </Helmet>
      <Header>
        <HStack w="full">
          <BackButton />
          <Heading size="md" ml={2} py={4} noOfLines={1}>
            {data?.name}
          </Heading>
          <Spacer />
          <IconButton
            aria-label="open in browser"
            as={Link}
            href={data?.alternateLink ?? ''}
            variant="ghost"
            size="lg"
            isRound
            isExternal
            icon={<Icon as={TbExternalLink} boxSize={6} />}
          />
        </HStack>
      </Header>
      <ChakraPullToRefresh
        w="full"
        minH="100vh"
        onRefresh={async () => {
          await queryClient.resetQueries({
            queryKey: ['google', id, 'timeline'],
          });
        }}
      >
        <VStack p={4} mb={24}>
          <CourseHeader courseId={id} />
          {isLoading ? (
            <Loading withTips initialTip={0} />
          ) : error ? (
            <Error error={error} />
          ) : (
            <Virtuoso
              ref={scrollRef}
              style={{ height: '100%', width: '100%' }}
              context={{ loadMore: null, loading: isFetchingNextPage }}
              data={timeline?.pages.flat()}
              itemContent={(index, post) => (
                <Box py={4}>
                  <Post {...post} />
                </Box>
              )}
              itemsRendered={() =>
                scrollRef.current?.getState((state) => setScrollState(state))
              }
              restoreStateFrom={scrollState}
              endReached={async () => {
                if (hasNextPage) await fetchNextPage();
              }}
              components={{
                Footer,
              }}
              useWindowScroll
            />
          )}
        </VStack>
      </ChakraPullToRefresh>
    </>
  );
}
