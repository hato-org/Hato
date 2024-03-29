import React, { useMemo } from 'react';
import {
  HStack,
  Spacer,
  Icon,
  Text,
  VStack,
  Wrap,
  Tooltip,
  Avatar,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { format, isThisYear } from 'date-fns/esm';
import { useNavigate } from 'react-router-dom';
import {
  TbAlbum,
  TbCheckupList,
  TbHelpCircle,
  TbChevronRight,
  TbMessage,
} from 'react-icons/tb';
import Card from '../layout/Card';
import Material from './Material';
import { GCTimeline } from '@/@types/classroom';
import { useStringHSLColor } from '@/hooks/common/color';
import UserInfo from './UserInfo';
import {
  useGCAnnouncement,
  useGCCourseWork,
  useGCCourseworkMaterial,
} from '@/services/classroom';

const Post = React.memo(
  ({
    type,
    id,
    courseId,
    updateTime,
    text,
    title,
    materials,
    creatorUserId,
  }: GCTimeline) => {
    const navigate = useNavigate();
    const iconColor = useStringHSLColor(window.btoa(courseId ?? ''));
    const icon = useMemo(() => {
      switch (type) {
        case 'announcement':
          return TbMessage;
        case 'courseWork':
          return TbCheckupList;
        case 'courseWorkMaterial':
          return TbAlbum;
        default:
          return TbHelpCircle;
      }
    }, [type]);

    const typeText = (() => {
      switch (type) {
        case 'announcement':
          return 'お知らせ';
        case 'courseWork':
          return '課題';
        case 'courseWorkMaterial':
          return '資料';
        default:
          return 'その他';
      }
    })();

    return (
      <Card>
        <VStack p={2} spacing={4} align="flex-start" w="full" userSelect="text">
          <HStack
            w="full"
            onClick={() =>
              navigate(`/classroom/course/${courseId}/${type}/${id}`)
            }
            _hover={{
              cursor: 'pointer',
            }}
          >
            <HStack spacing={4} align="center">
              <Tooltip label={typeText} fontSize="md" openDelay={300}>
                <Avatar bg={iconColor} icon={<Icon as={icon} boxSize={7} />} />
              </Tooltip>
            </HStack>
            <UserInfo courseId={courseId} userId={creatorUserId} />
            <Spacer />
            <Text textStyle="description">
              {format(
                new Date(updateTime ?? 0),
                isThisYear(new Date(updateTime ?? 0)) ? 'MM/dd' : 'yyyy/MM/dd',
              )}
            </Text>
            <Icon as={TbChevronRight} />
          </HStack>
          {title && <Text textStyle="title">{title}</Text>}
          {text && (
            <Text wordBreak="break-word" whiteSpace="pre-wrap" fontSize="sm">
              {text}
            </Text>
          )}
          {type === 'announcement' && materials?.length && (
            <Wrap>
              {materials?.map((material) => (
                <Material key={JSON.stringify(material)} {...material} />
              ))}
            </Wrap>
          )}
        </VStack>
      </Card>
    );
  },
);

export const AsyncPost = React.memo(
  ({
    type,
    courseId,
    id,
  }: {
    type: 'announcement' | 'courseWork' | 'courseWorkMaterial';
    courseId?: string;
    id?: string;
  }) => {
    const { data: announcement, isPending: announcementPending } =
      useGCAnnouncement({ courseId, id }, { enabled: type === 'announcement' });
    const { data: courseWork, isPending: courseWorkPending } = useGCCourseWork(
      { courseId, id },
      { enabled: type === 'courseWork' },
    );
    const { data: courseWorkMaterial, isPending: courseWorkMaterialPending } =
      useGCCourseworkMaterial(
        { courseId, id },
        { enabled: type === 'courseWorkMaterial' },
      );

    if (
      (type === 'announcement' && announcementPending) ||
      (type === 'courseWork' && courseWorkPending) ||
      (type === 'courseWorkMaterial' && courseWorkMaterialPending)
    )
      return <PostPlaceholder />;

    // eslint-disable-next-line consistent-return
    const post = (() => {
      // eslint-disable-next-line default-case
      switch (type) {
        case 'announcement':
          return { type, ...announcement };
        case 'courseWork':
          return { type, ...courseWork };
        case 'courseWorkMaterial':
          return { type, ...courseWorkMaterial };
      }
    })();

    return <Post {...post} />;
  },
);

function PostPlaceholder() {
  return (
    <Card>
      <VStack w="full" align="flex-start" p={2}>
        <SkeletonCircle size="12" />

        <SkeletonText noOfLines={4} skeletonHeight="4" />
      </VStack>
    </Card>
  );
}

export default Post;
