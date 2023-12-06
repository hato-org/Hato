import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Icon,
  StackDivider,
  Spacer,
  IconButton,
  Link,
  Wrap,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { TbExclamationCircle, TbExternalLink } from 'react-icons/tb';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { useAtom } from 'jotai';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import {
  useGCUserInfo,
  useGCAnnouncement,
  useGCCourseInfo,
} from '@/services/classroom';
import Material from '@/components/classroom/Material';
import Error from '@/components/cards/Error';
import { GCBookmarkAtom } from '@/store/classroom';

export default function ClassroomAnnouncement() {
  const { id, announcementId } = useParams();
  const [bookmarks, setBookmarks] = useAtom(GCBookmarkAtom);
  const { data, isPending, error } = useGCAnnouncement({
    courseId: id,
    id: announcementId,
  });
  const {
    data: userInfo,
    isPending: isUserPending,
    error: userError,
  } = useGCUserInfo(data?.creatorUserId);

  const { data: courseInfo, isPending: isCoursePending } = useGCCourseInfo(id);

  const isBookmarked = bookmarks.some(
    (bookmark) =>
      JSON.stringify(bookmark) ===
      JSON.stringify({
        type: 'announcement',
        courseId: id,
        id: announcementId,
      }),
  );

  return (
    <Box>
      <Helmet>
        <title>{`お知らせの詳細 - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <Header>
        <HStack w="full">
          <BackButton />
          <Heading size="md" py={4}>
            お知らせの詳細
          </Heading>
          <Spacer />
          <IconButton
            aria-label="bookmark"
            variant="ghost"
            size="lg"
            isRound
            icon={
              <Icon
                color={isBookmarked ? 'blue.400' : undefined}
                as={isBookmarked ? IoBookmark : IoBookmarkOutline}
                boxSize={5}
              />
            }
            onClick={() =>
              setBookmarks((currVal) =>
                isBookmarked
                  ? currVal.filter(
                      (bookmark) =>
                        JSON.stringify(bookmark) !==
                        JSON.stringify({
                          type: 'announcement',
                          courseId: id,
                          id: announcementId,
                        }),
                    )
                  : [
                      ...currVal,
                      {
                        type: 'announcement',
                        courseId: id ?? '',
                        id: announcementId ?? '',
                      },
                    ],
              )
            }
          />
          <IconButton
            aria-label="open in browser"
            as={Link}
            href={data?.alternateLink ?? ''}
            isExternal
            size="lg"
            variant="ghost"
            isRound
            icon={<Icon as={TbExternalLink} boxSize={6} />}
          />
        </HStack>
      </Header>

      {error ? (
        <Error error={error} />
      ) : (
        <VStack
          p={6}
          pb={32}
          w="full"
          align="flex-start"
          spacing={4}
          userSelect="text"
        >
          <HStack w="full" spacing={4}>
            <StackDivider
              rounded="full"
              borderWidth={2}
              borderColor="blue.400"
            />
            <VStack w="full" align="flex-start" spacing={1}>
              <Skeleton
                minH={8}
                minW={40}
                rounded="lg"
                isLoaded={!isUserPending}
              >
                {userError ? (
                  <HStack>
                    <Icon
                      as={TbExclamationCircle}
                      color="yellow.400"
                      boxSize={6}
                    />
                    <Text color="description" fontSize="2xl" fontWeight="bold">
                      エラー
                    </Text>
                  </HStack>
                ) : (
                  <Text textStyle="title" fontSize="2xl">
                    {userInfo?.name?.fullName}
                  </Text>
                )}
              </Skeleton>
              <Skeleton
                minH={6}
                minW={20}
                rounded="md"
                isLoaded={!isCoursePending}
              >
                <Link
                  as={RouterLink}
                  to={`/classroom/course/${courseInfo?.id}`}
                  textStyle="description"
                >
                  {courseInfo?.name}
                </Link>
              </Skeleton>
            </VStack>
          </HStack>
          <SkeletonText
            w="full"
            mt={2}
            noOfLines={3}
            skeletonHeight={4}
            spacing={2}
            isLoaded={!isPending}
          >
            <Text whiteSpace="pre-wrap" textStyle="description" color="title">
              {data?.text}
            </Text>
          </SkeletonText>
          <Wrap>
            {data?.materials?.map((material) => (
              <Material key={JSON.stringify(material)} {...material} />
            ))}
          </Wrap>
        </VStack>
      )}
    </Box>
  );
}
