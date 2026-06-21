import { useMemo } from 'react';
import { HStack, Icon, Center, Box, IconButton, Presence } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router';
import { useAtomValue } from 'jotai';
import {
  TbHome,
  TbClipboardList,
  TbCalendar,
  // TbFileDescription,
} from 'react-icons/tb';
import { SiGoogleclassroom } from 'react-icons/si';
import { MdOutlineTrain } from 'react-icons/md';
import { dashboardEditModeAtom } from '@/store/dashboard';

function BottomNavbar() {
  const editMode = useAtomValue(dashboardEditModeAtom);

  const location = useLocation();

  const menu = useMemo(
    () => [
      {
        icon: <Icon as={TbHome} boxSize={8} />,
        label: 'ホーム',
        href: '/dashboard',
      },
      {
        icon: <Icon as={TbClipboardList} boxSize={8} />,
        label: '時間割',
        href: '/timetable',
      },
      {
        icon: <Icon as={SiGoogleclassroom} boxSize={8} p="2px" />,
        label: 'Classroom',
        href: '/classroom',
      },
      {
        icon: <Icon as={TbCalendar} boxSize={8} />,
        label: 'カレンダー',
        href: '/events',
      },
      // {
      //   icon: <Icon as={TbFileDescription} boxSize={8} />,
      //   label: '掲示物',
      //   href: '/posts/hatoboard',
      // },
      {
        icon: <Icon as={MdOutlineTrain} boxSize={8} />,
        label: '交通情報',
        href: '/transit',
      },
    ],
    [],
  );

  return (
    <Presence
      present={!editMode}
      position="fixed"
      bottom={0}
      insetX={0}
      zIndex={10}
      animationName={{
        _open: 'slide-from-bottom-full',
        _closed: 'slide-to-bottom-full',
      }}
      animationDuration="moderate"
    >
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
            <Center w="100%" flexGrow={1} key={label} py={1} asChild>
              <Link to={href}>
                <IconButton
                  aria-label={label}
                  size="lg"
                  variant="ghost"
                  color={location.pathname === href ? 'blue.300' : 'title'}
                  borderRadius="full"
                >{icon}</IconButton>
              </Link>
            </Center>
          ))}
        </HStack>
        {/* <Box w="100%">
        <Collapsible.Root open={!onlineManager.isOnline()}><Collapsible.Content>
          <HStack w="100%" justify="center" py={1}>
            <Icon as={TbCloudOff} w={6} h={6} />
            <Text textStyle="title">オフライン</Text>
          </HStack>
        </Collapsible.Content></Collapsible.Root>
      </Box> */}
      </Box>
    </Presence>
  );
}

export default BottomNavbar;
