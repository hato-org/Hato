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
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';
import { TbMenu2 } from 'react-icons/tb';
import { useSetAtom } from 'jotai';
import { overlayAtom } from '@/store/overlay';
import StatusBanner from './StatusBanner';

interface HeaderProps extends CenterProps {
  withMenu?: boolean;
}

const Header = React.memo(({ withMenu, children, ...rest }: HeaderProps) => {
  const border = useColorModeValue('border', 'transparent');
  const isFetching = useIsFetching();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const setOverlay = useSetAtom(overlayAtom);

  const onMenuOpen = useCallback(
    () => setOverlay((currVal) => ({ ...currVal, menu: true })),
    [setOverlay],
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
      <StatusBanner />
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
