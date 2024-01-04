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
import { useGradeList } from '@/services/info';
import { useUser, useUserMutation } from '@/services/user';

export default function AccountGrade() {
  const { data: user } = useUser();
  const {
    data: gradeList,
    error: gradeError,
    isPending: isGradePending,
  } = useGradeList();
  const { mutate, isPending } = useUserMutation();

  return (
    <Menu>
      <Skeleton isLoaded={!isGradePending} rounded="lg">
        {gradeError ? (
          <HStack py={2}>
            <Icon as={TbAlertCircle} color="red.500" />
            <Text textStyle="title">エラー</Text>
          </HStack>
        ) : (
          <MenuButton
            isDisabled={isPending}
            as={Button}
            variant="unstyled"
            id="grade-select"
            rounded="lg"
            w="100%"
          >
            <HStack py={2} pl={4} justify="flex-end">
              <Text textStyle="title">
                {gradeList?.find(
                  ({ type, gradeCode }) =>
                    type === user.type && gradeCode === user.grade,
                )?.name ?? '未設定'}
              </Text>
              <Icon as={TbChevronDown} />
            </HStack>
          </MenuButton>
        )}
      </Skeleton>
      <MenuList shadow="lg" rounded="xl" py={2}>
        {gradeList?.map(({ name, type, gradeCode }) => (
          <MenuItem
            onClick={() => {
              mutate({ type, grade: gradeCode });
            }}
            key={name}
            fontWeight="bold"
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
