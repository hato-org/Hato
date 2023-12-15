import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
} from '@chakra-ui/react';
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
    <Menu>
      <Skeleton isLoaded={!isCoursePending} rounded="lg">
        {courseError ? (
          <HStack py={2}>
            <Icon as={TbAlertCircle} color="red.500" />
            <Text textStyle="title">エラー</Text>
          </HStack>
        ) : (
          <MenuButton
            isDisabled={!courseList?.length || isPending}
            as={Button}
            variant="unstyled"
            id="course-select"
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
          </MenuButton>
        )}
      </Skeleton>
      <MenuList shadow="lg" rounded="xl" py={2}>
        {courseList?.map(({ name, code }) => (
          <MenuItem
            onClick={() => {
              mutate({ course: code });
            }}
            key={code}
            fontWeight="bold"
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
