import React from 'react';
import {
  HStack,
  Skeleton,
  Text,
  VStack,
  Icon,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import { TbAlertCircle } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';
import { useGCUserInfo } from '@/hooks/classroom/user';
import { useGCCourseInfo } from '@/hooks/classroom/course';

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
      isLoading: courseLoading,
      isError: courseError,
    } = useGCCourseInfo(courseId);
    const {
      data: user,
      isLoading: userLoading,
      isError: userError,
    } = useGCUserInfo(userId);

    return (
      <VStack spacing={0} align="flex-start">
        <Skeleton minH={6} minW={32} rounded="md" isLoaded={!userLoading}>
          {userError ? (
            <Tooltip label="権限の問題により、教師以外のユーザー情報は取得できません">
              <HStack spacing={1}>
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
          isLoaded={!courseLoading}
          onClick={(e) => e.stopPropagation()}
        >
          {courseError ? (
            <HStack spacing={1}>
              <Icon as={TbAlertCircle} boxSize={4} color="yellow.400" />
              <Text textStyle="description" fontWeight="bold">
                エラー
              </Text>
            </HStack>
          ) : (
            <Link
              as={RouterLink}
              to={`/classroom/course/${course?.id}`}
              color="description"
              fontSize="xs"
              noOfLines={1}
            >
              {course?.name}
            </Link>
          )}
        </Skeleton>
      </VStack>
    );
  }
);

export default UserInfo;
