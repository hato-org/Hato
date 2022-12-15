import {
  Avatar,
  Flex,
  FlexProps,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';
import { useUser } from '@/hooks/user';

function Account({ ...rest }: FlexProps) {
  const { data: user } = useUser();

  return (
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
        {/* <Icon as={TbChevronDown} /> */}
      </HStack>
    </Flex>
  );
}

export default Account;
