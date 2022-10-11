import {
  Avatar,
  Collapse,
  Divider,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { TbUser, TbChevronDown, TbSettings, TbLogout } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/user';
import { useAuth } from '@/modules/auth';

function Account({ ...rest }: FlexProps) {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  const menu = useMemo(
    () => [
      {
        icon: TbSettings,
        label: '設定',
        onClick: () => {
          navigate('/settings');
        },
      },
      {
        icon: TbLogout,
        label: 'ログアウト',
        onClick: logout,
      },
    ],
    [logout, navigate]
  );

  return (
    <Flex
      p={4}
      {...rest}
      border="1px solid"
      borderColor="gray.100"
      direction="column"
    >
      <HStack spacing={4} onClick={onToggle}>
        <Avatar src={user?.avatar} icon={<TbUser />} />
        <VStack align="flex-start" spacing={0}>
          <Text fontSize="xl" fontWeight="bold" color="gray.500">
            {user?.name}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {user?.email}
          </Text>
        </VStack>
        <Spacer />
        <Icon as={TbChevronDown} />
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <Divider py={2} />
        <VStack divider={<Divider />} py={2} align="flex-start">
          {menu.map(({ icon, label, onClick }) => (
            <HStack px={4} spacing={4} onClick={onClick} w="100%" key={label}>
              <Icon as={icon} w={6} h={6} color="gray.500" />
              <Text color="gray.500">{label}</Text>
            </HStack>
          ))}
        </VStack>
      </Collapse>
    </Flex>
  );
}

export default Account;
