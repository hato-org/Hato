import { Drawer as ChakraDrawer, Portal } from '@chakra-ui/react';
import { CloseButton } from './close-button';
import * as React from 'react';

interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  offset?: ChakraDrawer.ContentProps['padding'];
  backdrop?: boolean;
}

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(function DrawerContent(props, ref) {
  const {
    children,
    portalled = true,
    portalRef,
    offset,
    backdrop = true,
    ...rest
  } = props;
  return (
    <Portal disabled={!portalled} container={portalRef}>
      {backdrop && <ChakraDrawer.Backdrop />}
      <ChakraDrawer.Positioner padding={offset}>
        {/* textStyle: v2 DrawerContent の本文サイズ (16px) に合わせる */}
        <ChakraDrawer.Content
          textStyle="md"
          ref={ref}
          {...rest}
          asChild={false}
        >
          {children}
        </ChakraDrawer.Content>
      </ChakraDrawer.Positioner>
    </Portal>
  );
});

export const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  return (
    <ChakraDrawer.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="sm" ref={ref} />
    </ChakraDrawer.CloseTrigger>
  );
});

export const DrawerTrigger = ChakraDrawer.Trigger;
export const DrawerRoot = ChakraDrawer.Root;
export const DrawerFooter = ChakraDrawer.Footer;

// v2 DrawerHeader (fontSize xl / semibold / py=4、block 表示)・DrawerBody (py=2) の既定値を再現
export const DrawerHeader = (props: ChakraDrawer.HeaderProps) => (
  <ChakraDrawer.Header
    display="block"
    textStyle="xl"
    fontWeight="semibold"
    pt="4"
    pb="4"
    {...props}
  />
);
export const DrawerBody = (props: ChakraDrawer.BodyProps) => (
  <ChakraDrawer.Body pt="2" pb="2" {...props} />
);
export const DrawerBackdrop = ChakraDrawer.Backdrop;
export const DrawerDescription = ChakraDrawer.Description;
export const DrawerTitle = ChakraDrawer.Title;
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger;
