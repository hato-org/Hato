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
  Fade,
  SkeletonText,
  Center,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { TbExternalLink } from 'react-icons/tb';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { format } from 'date-fns/esm';
import { useRecoilState } from 'recoil';
import { useGCCourseWork } from '@/hooks/classroom/coursework';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import { useGCUserInfo } from '@/hooks/classroom/user';
import Material from '@/components/classroom/Material';
import { generateDateFromGCDate } from '@/utils/classroom';
import Error from '@/components/cards/Error';
import { GCBookmarkAtom } from '@/store/classroom';

export default function ClassroomCoursework() {
  const { id, courseworkId } = useParams();
  const [bookmarks, setBookmarks] = useRecoilState(GCBookmarkAtom);
  const { data, isLoading, error } = useGCCourseWork({
    courseId: id,
    id: courseworkId,
  });
  const { data: userInfo, isLoading: userLoading } = useGCUserInfo(
    data?.creatorUserId
  );

  const isBookmarked = bookmarks.some(
    (bookmark) =>
      JSON.stringify(bookmark) ===
      JSON.stringify({
        type: 'courseWork',
        courseId: id,
        id: courseworkId,
      })
  );

  return (
    <Box>
      <Helmet>
        <title>{`${data?.title} - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <Header>
        <HStack w="full">
          <BackButton />
          <Heading size="md" py={4}>
            課題の詳細
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
                          type: 'courseWork',
                          courseId: id,
                          id: courseworkId,
                        })
                    )
                  : [
                      ...currVal,
                      {
                        type: 'courseWork',
                        courseId: id ?? '',
                        id: courseworkId ?? '',
                      },
                    ]
              )
            }
          />
          <IconButton
            aria-label="open in browser"
            as={Link}
            href={data?.alternateLink}
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
        <VStack p={6} w="full" align="flex-start" spacing={4} userSelect="text">
          <HStack w="full" spacing={4}>
            <StackDivider
              rounded="full"
              borderWidth={2}
              borderColor="blue.400"
            />
            <VStack w="full" align="flex-start" spacing={1}>
              <Skeleton minH={8} minW={40} rounded="lg" isLoaded={!isLoading}>
                <Text textStyle="title" fontSize="2xl">
                  {data?.title}
                </Text>
              </Skeleton>
              <Skeleton minH={6} minW={20} rounded="md" isLoaded={!userLoading}>
                <Text textStyle="description">{userInfo?.name?.fullName}</Text>
              </Skeleton>
            </VStack>
          </HStack>
          <SkeletonText
            noOfLines={2}
            skeletonHeight={2}
            spacing={4}
            isLoaded={!isLoading}
          >
            <Text whiteSpace="pre-wrap" textStyle="description">
              {data?.description}
            </Text>
          </SkeletonText>
          <Wrap>
            {data?.materials?.map((material) => (
              <Material key={JSON.stringify(material)} {...material} />
            ))}
          </Wrap>
          <Fade in={!!data} style={{ width: '100%' }}>
            <StackDivider borderWidth={1} mb={4} />
            <VStack align="flex-start">
              <HStack>
                <Text textStyle="title" fontSize="xl">
                  期限
                </Text>
                <Spacer />
                <Text>
                  {data?.dueDate
                    ? format(
                        generateDateFromGCDate({
                          date: data.dueDate,
                          timeOfDay: data.dueTime,
                        }),
                        'MM/dd HH:mm'
                      )
                    : 'なし'}
                </Text>
              </HStack>
              {data?.maxPoints && (
                <HStack>
                  <Text textStyle="title" fontSize="xl">
                    満点
                  </Text>
                  <Spacer />
                  <Text>{data.maxPoints}点</Text>
                </HStack>
              )}
              <Center w="full" pt={4}>
                <Text textStyle="description" fontWeight="bold">
                  課題の提出はClassroom上で行ってください
                </Text>
              </Center>
            </VStack>
          </Fade>
        </VStack>
      )}
    </Box>
  );
}
