import { useRef } from 'react';
import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import {
  TbBookmark,
  TbExclamationCircle,
  TbExternalLink,
} from 'react-icons/tb';
import Header from '@/components/nav/Header';
import Error from '@/components/cards/Error';
import Post from '@/components/classroom/Post';
import Footer from '@/components/classroom/LoadingFooter';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Loading from '@/components/common/Loading';
import { GCScrollIndexAtomFamily } from '@/store/classroom';
import { useGCTimeline } from '@/services/classroom';
import { useUser } from '@/services/user';
import LoginButton from '@/components/login/LoginButton';

const scopes = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.announcements.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.course-work.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials',
];

export default function Classroom() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [scrollState, setScrollState] = useAtom(
    GCScrollIndexAtomFamily('timeline'),
  );
  const scrollRef = useRef<VirtuosoHandle>(null);
  const {
    data: timeline,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGCTimeline();

  if (error?.response?.status === 401)
    return (
      // @ts-ignore
      <VStack spacing={8} w="full" h={[['100dvh', '100vh']]} justify="center">
        <Icon as={TbExclamationCircle} boxSize={24} color="yellow.400" />
        <Text textAlign="center" textStyle="title" fontSize="xl">
          Classroomと連携するには、
          <br />
          Hatoに追加の権限を許可してください
          <br />
          <Text as="span" textStyle="description">
            （表示される項目をすべて許可してください）
          </Text>
        </Text>
        <LoginButton scopes={scopes} />
      </VStack>
    );

  return (
    <Box>
      <Helmet>
        <title>Classroom - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="full">
          <Heading size="md" ml={2} py={4}>
            Classroom
          </Heading>
        </HStack>
        <Spacer />
        <IconButton
          aria-label="bookmarks"
          variant="ghost"
          isRound
          size="lg"
          icon={<Icon as={TbBookmark} boxSize={6} />}
          as={RouterLink}
          to="/classroom/bookmarks"
        />
        <IconButton
          aria-label="open in browser"
          variant="ghost"
          isRound
          size="lg"
          icon={<Icon as={TbExternalLink} boxSize={6} />}
          as={Link}
          href={`https://classroom.google.com/u/${user.email}`}
          isExternal
        />
      </Header>
      <ChakraPullToRefresh
        w="full"
        minH="100vh"
        pb={16}
        onRefresh={async () =>
          // queryClient.invalidateQueries(['google', 'timeline'])
          queryClient.resetQueries({ queryKey: ['google', 'timeline'] })
        }
      >
        <Box px={4} mb={24}>
          {/* eslint-disable no-nested-ternary */}
          {isLoading ? (
            <Loading withTips initialTip={0} />
          ) : error ? (
            <Error error={error} />
          ) : (
            <Virtuoso
              ref={scrollRef}
              context={{ loadMore: null, loading: isFetchingNextPage }}
              style={{ height: '100%', width: '100%' }}
              data={timeline?.pages?.flat()}
              itemContent={(index, post) => (
                <Box py={4}>
                  <Post {...post} />
                </Box>
              )}
              endReached={async () => {
                if (hasNextPage) await fetchNextPage();
              }}
              itemsRendered={() =>
                scrollRef.current?.getState((state) => setScrollState(state))
              }
              restoreStateFrom={scrollState}
              components={{
                Footer,
              }}
              useWindowScroll
            />
          )}
          {/* eslint-enable no-nested-ternary */}
        </Box>
      </ChakraPullToRefresh>
    </Box>
  );
}
