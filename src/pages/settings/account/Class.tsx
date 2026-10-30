import { Button, HStack, Icon, Skeleton, Text } from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
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
    <MenuRoot ids={{ trigger: 'class-select' }}>
      <Skeleton loading={isClassPending} rounded="lg">
        {classError ? (
          <HStack py={2}>
            <Icon as={TbAlertCircle} color="red.500" />
            <Text textStyle="title">エラー</Text>
          </HStack>
        ) : (
          <MenuTrigger asChild>
            <Button disabled={isPending} variant="plain" rounded="lg" w="100%">
              <HStack py={2} pl={4} justify="flex-end">
                <Text textStyle="title">
                  {classList?.find(({ classCode }) => user.class === classCode)
                    ?.name ?? '未設定'}
                </Text>
                <Icon as={TbChevronDown} />
              </HStack>
            </Button>
          </MenuTrigger>
        )}
      </Skeleton>
      <MenuContent shadow="lg" rounded="xl" py={2}>
        {classList?.map(({ name, type, gradeCode, classCode }) => (
          <MenuItem
            value={name}
            onClick={() => {
              mutate({ type, grade: gradeCode, class: classCode });
            }}
            key={name}
            fontWeight="bold"
          >
            {name}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
