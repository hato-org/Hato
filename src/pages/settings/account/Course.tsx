import { Button, HStack, Icon, Skeleton, Text } from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import { TbAlertCircle, TbChevronDown } from 'react-icons/tb';
import { useCourseList } from '@/services/info';
import { useUser, useUserMutation } from '@/services/user';

export default function AccountCourse() {
  const { data: user } = useUser();
  const {
    data: courseList,
    error: courseError,
    isPending: isCoursePending,
  } = useCourseList({ type: user.type, grade: user.grade });
  const { mutate, isPending } = useUserMutation();

  return (
    <MenuRoot ids={{ trigger: 'course-select' }}>
      <Skeleton loading={isCoursePending} rounded="lg">
        {courseError ? (
          <HStack py={2}>
            <Icon as={TbAlertCircle} color="red.500" />
            <Text textStyle="title">エラー</Text>
          </HStack>
        ) : (
          <MenuTrigger asChild>
            <Button
              disabled={!courseList?.length || isPending}
              variant="plain"
              rounded="lg"
              w="100%"
            >
              <HStack py={2} pl={4} justify="flex-end">
                <Text textStyle="title">
                  {courseList?.find(({ code }) => user.course === code)?.name ??
                    '未設定'}
                </Text>
                <Icon as={TbChevronDown} />
              </HStack>
            </Button>
          </MenuTrigger>
        )}
      </Skeleton>
      <MenuContent shadow="lg" rounded="xl" py={2}>
        {courseList?.map(({ name, code }) => (
          <MenuItem
            value={code}
            onClick={() => {
              mutate({ course: code });
            }}
            key={code}
            fontWeight="bold"
          >
            {name}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
