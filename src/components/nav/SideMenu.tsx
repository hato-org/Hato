import React, { useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Portal,
  Show,
  Spacer,
  StackDivider,
  StackProps,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import {
  TbHome,
  TbClipboardList,
  TbCalendar,
  TbFileDescription,
  TbSettings,
  TbBook2,
  TbLogout,
} from 'react-icons/tb';
import { MdOutlineTrain } from 'react-icons/md';
import { SiGoogleclassroom } from 'react-icons/si';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { overlayAtom } from '@/store/overlay';
import { useAuth } from '@/modules/auth';
import Account from '../login/Account';

export default function SideMenu() {
  return (
    <>
      <Show below="md">
        <SideMenuDrawer />
      </Show>
      <Show above="md">
        <Box px={2}>
          <MenuBody />
        </Box>
      </Show>
    </>
  );
}

export function SideMenuDrawer() {
  const location = useLocation();
  const [overlay, setOverlay] = useRecoilState(overlayAtom);
  const onClose = useCallback(
    () => setOverlay((currVal) => ({ ...currVal, menu: false })),
    [setOverlay]
  );

  useEffect(() => {
    onClose();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Portal>
      <Drawer isOpen={overlay.menu} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg="panel">
          <DrawerCloseButton top={9} right={8} />
          <DrawerBody p={4}>
            <MenuBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
}

function MenuBody() {
  const { logout } = useAuth();
  const location = useLocation();
  const breakPoint = useBreakpointValue({ base: 0, md: 1, lg: 2 }) ?? 0;

  const menu = useMemo<
    (
      | ({
          type: 'button';
          icon: JSX.Element;
          label: string;
          href: string;
        } & StackProps)
      | {
          type: 'divider';
        }
    )[]
  >(
    () => [
      {
        type: 'button',
        icon: <Icon as={TbHome} boxSize={7} />,
        label: 'ホーム',
        href: '/dashboard',
      },
      {
        type: 'button',
        icon: <Icon as={TbClipboardList} boxSize={7} />,
        label: '時間割',
        href: '/timetable',
      },
      {
        type: 'button',
        icon: <Icon as={SiGoogleclassroom} boxSize={7} p="2px" />,
        label: 'Classroom',
        href: '/classroom',
      },
      {
        type: 'button',
        icon: <Icon as={TbCalendar} boxSize={7} />,
        label: '年間行事予定',
        href: '/events',
      },
      {
        type: 'button',
        icon: <Icon as={TbFileDescription} boxSize={7} />,
        label: 'はとボード',
        href: '/posts/hatoboard',
      },
      {
        type: 'button',
        icon: <Icon as={TbBook2} boxSize={7} />,
        label: '図書館',
        href: '/library',
      },
      {
        type: 'button',
        icon: <Icon as={MdOutlineTrain} boxSize={7} />,
        label: '交通情報',
        href: '/transit',
      },
      {
        type: 'divider',
      },
      {
        type: 'button',
        icon: <Icon as={TbSettings} boxSize={7} />,
        label: '設定',
        href: '/settings',
      },
      {
        type: 'button',
        icon: <Icon as={TbLogout} boxSize={7} />,
        label: 'ログアウト',
        href: '#',
        onClick: () => logout(),
        color: 'red.500',
      },
    ],
    [logout]
  );

  return (
    <VStack w="100%" h="100%" spacing={2} pb="env(safe-area-inset-bottom)">
      <HStack w="100%" spacing={0}>
        <Image src="/logo_alpha.png" boxSize={12} />
        {breakPoint !== 1 && (
          <Heading
            w="100%"
            p={2}
            pt={4}
            size="2xl"
            fontFamily="Josefin Sans, -apple-system, sans-serif"
          >
            Hato
          </Heading>
        )}
      </HStack>
      {menu.map(
        (menuItem, index) =>
          /* eslint-disable no-nested-ternary */
          menuItem.type === 'divider' ? (
            <StackDivider
              // eslint-disable-next-line react/no-array-index-key
              key={`${menuItem.type}-${index}`}
              borderWidth="1px"
              borderColor="border"
            />
          ) : breakPoint === 1 ? (
            <IconButton
              aria-label={menuItem.label}
              icon={menuItem.icon}
              size="lg"
              variant="ghost"
              isRound
              color={
                menuItem.color ??
                (location.pathname === menuItem.href ? 'blue.400' : undefined)
              }
              as={RouterLink}
              to={menuItem.href}
              onClick={
                menuItem.onClick as unknown as React.MouseEventHandler<HTMLButtonElement>
              }
            />
          ) : (
            <HStack
              p={2}
              key={menuItem.label}
              w="100%"
              spacing={4}
              color={
                location.pathname === menuItem.href ? 'blue.400' : undefined
              }
              layerStyle="button"
              rounded="xl"
              as={RouterLink}
              to={menuItem.href}
              {...menuItem}
            >
              {menuItem.icon}
              <Text
                color={
                  menuItem.color ??
                  (location.pathname === menuItem.href ? 'blue.400' : undefined)
                }
                textStyle="title"
                fontSize="lg"
              >
                {menuItem.label}
              </Text>
            </HStack>
          )
        /* eslint-enable no-nested-ternary */
      )}
      <Spacer />
      <Account />
    </VStack>
  );
}
