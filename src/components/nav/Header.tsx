import React, { useCallback } from 'react';
import {
  Box,
  Center,
  CenterProps,
  Collapsible,
  HStack,
  Icon,
  IconButton,
  Progress,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useIsFetching } from '@tanstack/react-query';
import { TbMenu2 } from 'react-icons/tb';
import { useSetAtom } from 'jotai';
import { menuAtom } from '@/store/overlay';
import StatusBanner from './StatusBanner';

interface HeaderProps extends CenterProps {
  withMenu?: boolean;
}

const Header = React.memo(({ withMenu, children, ...rest }: HeaderProps) => {
  const border = useColorModeValue('border', 'transparent');
  const isFetching = useIsFetching();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const setMenu = useSetAtom(menuAtom);

  const onMenuOpen = useCallback(() => setMenu(true), [setMenu]);

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
      <HStack px={2} w="100%" gap={0}>
        {withMenu && isMobile && (
          <IconButton
            aria-label="menu"
            variant="ghost"
            borderRadius="full"
            size="lg"
            onClick={onMenuOpen}
          >{<Icon as={TbMenu2} boxSize={6} />}</IconButton>
        )}
        {children}
      </HStack>
      <Box w="100%" pos="absolute" bottom={0}>
        <Collapsible.Root open={!!isFetching}><Collapsible.Content>
          <Progress w="100%" size="xs" isIndeterminate />
        </Collapsible.Content></Collapsible.Root>
      </Box>
    </Center>
  );
});
Header.displayName = 'Header';

export default Header;
