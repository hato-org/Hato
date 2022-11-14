import { HStack, Icon, Center, Box, IconButton } from '@chakra-ui/react';
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
        icon: <Icon as={TbHome} h={8} w={8} />,
        label: 'ホーム',
        href: '/',
      },
      {
        icon: <Icon as={TbClipboardList} h={8} w={8} />,
        label: '時間割',
        href: '/timetable',
      },
      {
        icon: <Icon as={TbCalendar} h={8} w={8} />,
        label: 'カレンダー',
        href: '/events',
      },
      {
        icon: <Icon as={TbFileDescription} h={8} w={8} />,
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
      borderColor="border"
    >
      <HStack w="100%" justify="space-around">
        {menu.map(({ icon, label, href }) => (
          <Center w="100%" flexGrow={1} as={Link} to={href} key={label} py={1}>
            <IconButton
              aria-label={label}
              icon={icon}
              size="lg"
              variant="ghost"
              color={location.pathname === href ? 'blue.300' : 'title'}
              isRound
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
