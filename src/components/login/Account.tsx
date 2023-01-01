import {
  Avatar,
  Flex,
  FlexProps,
  HStack,
  Spacer,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';
import { useUser } from '@/hooks/user';

function Account({ ...rest }: FlexProps) {
  const { data: user } = useUser();
  const breakPoint = useBreakpointValue({ base: 0, md: 1, lg: 2 });

  return breakPoint !== 1 ? (
    <Flex
      p={2}
      px={4}
      maxW="100%"
      layerStyle="button"
      rounded="xl"
      direction="column"
      as={RouterLink}
      to="/settings/account"
      {...rest}
    >
      <HStack spacing={4}>
        <Avatar src={user?.avatar} size="sm" icon={<TbUser />} />
        {breakPoint !== 1 && (
          <>
            <VStack w="100%" align="flex-start" spacing={0}>
              <Text textStyle="title">{user?.name}</Text>
              <Text
                textStyle="description"
                fontSize="xs"
                wordBreak="break-all"
                noOfLines={1}
              >
                {user?.email}
              </Text>
            </VStack>
            <Spacer />
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="bold"
              whiteSpace="nowrap"
            >
              {user.contributionCount} pt
            </Text>
          </>
        )}
      </HStack>
    </Flex>
  ) : (
    <Avatar
      src={user.avatar}
      size="md"
      icon={<TbUser />}
      p={2}
      layerStyle="button"
      as={RouterLink}
      to="/settings/account"
    />
  );
}

export default Account;
