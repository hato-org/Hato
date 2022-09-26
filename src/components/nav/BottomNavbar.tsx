import { HStack, Icon, Center, Box } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  TbHome,
  TbClipboardList,
  TbCalendar,
  TbFileDescription,
} from 'react-icons/tb';
import { useMemo } from 'react';

function BottomNavbar() {
  const location = useLocation();

  const menu = useMemo(
    () => [
      {
        icon: TbHome,
        label: 'ホーム',
        href: '/',
      },
      {
        icon: TbClipboardList,
        label: '時間割',
        href: '/timetable',
      },
      {
        icon: TbCalendar,
        label: 'カレンダー',
        href: '/events',
      },
      {
        icon: TbFileDescription,
        label: '掲示物',
        href: '/posts/hatoboard',
      },
    ],
    []
  );

  return (
    <Box
      w="100%"
      pb="env(safe-area-inset-bottom)"
      zIndex={10}
      position="fixed"
      bottom={0}
      shadow="xl"
      bg="bg"
      borderTop="1px solid"
      borderColor="gray.100"
    >
      <HStack w="100%" justify="space-around">
        {menu.map(({ icon, label, href }) => (
          <Center w="100%" flexGrow={1} as={Link} to={href} key={label} py={2}>
            <Icon
              as={icon}
              w={8}
              h={8}
              color={location.pathname === href ? 'blue.300' : 'gray.600'}
            />
          </Center>
        ))}
      </HStack>
      {/* <Box w="100%">
        <Collapse in={!onlineManager.isOnline()}>
          <HStack w="100%" justify="center" py={1}>
            <Icon as={TbCloudOff} w={6} h={6} />
            <Text textStyle="title">オフライン</Text>
          </HStack>
        </Collapse>
      </Box> */}
    </Box>
  );
}

export default BottomNavbar;
