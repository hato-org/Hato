import { HStack, Icon, Center, Box, IconButton, Slide } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  TbHome,
  TbClipboardList,
  TbCalendar,
  TbFileDescription,
} from 'react-icons/tb';
import { useMemo } from 'react';
import { dashboardEditModeAtom } from '@/store/dashboard';

function BottomNavbar() {
  const editMode = useRecoilValue(dashboardEditModeAtom);

  const location = useLocation();

  const menu = useMemo(
    () => [
      {
        icon: <Icon as={TbHome} h={8} w={8} />,
        label: 'ホーム',
        href: '/dashboard',
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
    <Slide direction="bottom" in={!editMode}>
      <Box
        w="100%"
        pb="env(safe-area-inset-bottom)"
        zIndex={10}
        shadow="xl"
        bg="bg"
        borderTop="1px solid"
        borderColor="border"
      >
        <HStack w="100%" justify="space-around">
          {menu.map(({ icon, label, href }) => (
            <Center
              w="100%"
              flexGrow={1}
              as={Link}
              to={href}
              key={label}
              py={1}
            >
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
    </Slide>
  );
}

export default BottomNavbar;
