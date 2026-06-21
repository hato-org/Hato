import React from 'react';
import { HStack, Skeleton, Text, VStack, Icon, Link } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { TbAlertCircle } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router';
import { useGCUserInfo, useGCCourseInfo } from '@/services/classroom';

const UserInfo = React.memo(
  ({
    courseId,
    userId,
  }: {
    courseId?: string | null;
    userId?: string | null;
  }) => {
    const {
      data: course,
      isPending: isCoursePending,
      isError: courseError,
    } = useGCCourseInfo(courseId);
    const {
      data: user,
      isLoading: isUserPending,
      isError: userError,
    } = useGCUserInfo(userId);

    return (
      <VStack gap={0} align="flex-start">
        <Skeleton minH={6} minW={32} rounded="md" loading={isUserPending}>
          {userError ? (
            <Tooltip content="権限の問題により、教師以外のユーザー情報は取得できません">
              <HStack gap={1}>
                <Icon as={TbAlertCircle} boxSize={6} color="yellow.400" />
                <Text color="description" fontWeight="bold">
                  エラー
                </Text>
              </HStack>
            </Tooltip>
          ) : (
            <Text textStyle="title">{user?.name?.fullName}</Text>
          )}
        </Skeleton>
        <Skeleton
          minH={4}
          minW={20}
          rounded="md"
          loading={isCoursePending}
          onClick={(e) => e.stopPropagation()}
        >
          {courseError ? (
            <HStack gap={1}>
              <Icon as={TbAlertCircle} boxSize={4} color="yellow.400" />
              <Text textStyle="description" fontWeight="bold">
                エラー
              </Text>
            </HStack>
          ) : (
            <Link
              asChild
              color="description"
              fontSize="xs"
              lineClamp={1}
            >
              <RouterLink to={`/classroom/course/${course?.id}`}>
                {course?.name}
              </RouterLink>
            </Link>
          )}
        </Skeleton>
      </VStack>
    );
  },
);
UserInfo.displayName = 'UserInfo';

export default UserInfo;
