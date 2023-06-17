import React, { useCallback } from 'react';
import {
  Box,
  Center,
  CenterProps,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Progress,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { onlineManager, useIsFetching } from '@tanstack/react-query';
import { TbCloudOff, TbMenu2 } from 'react-icons/tb';
import { useSetRecoilState } from 'recoil';
import { overlayAtom } from '@/store/overlay';

interface HeaderProps extends CenterProps {
  withMenu?: boolean;
}

onlineManager.setEventListener((setOnline) => () => {
  window.addEventListener('online', () => setOnline(true));
  window.addEventListener('offline', () => setOnline(false));
});

const Header = React.memo(({ withMenu, children, ...rest }: HeaderProps) => {
  const border = useColorModeValue('border', 'transparent');
  const offlineBg = useColorModeValue('bg.300', 'bg.700');
  const isFetching = useIsFetching();
  const isOnline = onlineManager.isOnline();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const setOverlay = useSetRecoilState(overlayAtom);

  const onMenuOpen = useCallback(
    () => setOverlay((currVal) => ({ ...currVal, menu: true })),
    [setOverlay]
  );

  return (
    <Center
      position="sticky"
      flexDirection="column"
      w="100%"
      top={0}
      mb={4}
      borderBottom="1px solid"
      borderColor={border}
      bg="bgAlpha"
      backdropFilter="auto"
      backdropBlur="8px"
      shadow="xl"
      zIndex={10}
      {...rest}
    >
      <Box w="100%">
        <Collapse in={!isOnline}>
          <HStack w="100%" justify="center" py={1} bg={offlineBg}>
            <Icon as={TbCloudOff} w={6} h={6} />
            <Text textStyle="title">オフライン</Text>
          </HStack>
        </Collapse>
      </Box>
      <HStack px={2} w="100%" spacing={0}>
        {withMenu && isMobile && (
          <IconButton
            aria-label="menu"
            icon={<Icon as={TbMenu2} boxSize={6} />}
            variant="ghost"
            isRound
            size="lg"
            onClick={onMenuOpen}
          />
        )}
        {children}
      </HStack>
      <Box w="100%" pos="absolute" bottom={0}>
        <Collapse in={!!isFetching}>
          <Progress w="100%" size="xs" isIndeterminate />
        </Collapse>
      </Box>
    </Center>
  );
});

export default Header;
