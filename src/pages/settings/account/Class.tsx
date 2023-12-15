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
import { useClassList } from '@/services/info';
import { useUser, useUserMutation } from '@/services/user';

export default function AccountClass() {
  const { data: user } = useUser();
  const {
    data: classList,
    error: classError,
    isPending: isClassPending,
  } = useClassList({ type: user.type, grade: user.grade });
  const { mutate, isPending } = useUserMutation();

  return (
    <Menu>
      <Skeleton isLoaded={!isClassPending} rounded="lg">
        {classError ? (
          <HStack py={2}>
            <Icon as={TbAlertCircle} color="red.500" />
            <Text textStyle="title">エラー</Text>
          </HStack>
        ) : (
          <MenuButton
            isDisabled={isPending}
            as={Button}
            variant="unstyled"
            id="class-select"
            rounded="lg"
            w="100%"
          >
            <HStack py={2} pl={4} justify="flex-end">
              <Text textStyle="title">
                {classList?.find(({ classCode }) => user.class === classCode)
                  ?.name ?? '未設定'}
              </Text>
              <Icon as={TbChevronDown} />
            </HStack>
          </MenuButton>
        )}
      </Skeleton>
      <MenuList shadow="lg" rounded="xl" py={2}>
        {classList?.map(({ name, type, gradeCode, classCode }) => (
          <MenuItem
            onClick={() => {
              mutate({ type, grade: gradeCode, class: classCode });
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
