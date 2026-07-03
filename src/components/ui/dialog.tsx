import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import { CloseButton } from './close-button';
import * as React from 'react';

interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  backdrop?: boolean;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(props, ref) {
  const {
    children,
    portalled = true,
    portalRef,
    backdrop = true,
    ...rest
  } = props;

  return (
    <Portal disabled={!portalled} container={portalRef}>
      {backdrop && <ChakraDialog.Backdrop />}
      <ChakraDialog.Positioner>
        {/* textStyle: v2 ModalContent の本文サイズ (16px) に合わせる */}
        <ChakraDialog.Content
          textStyle="md"
          ref={ref}
          {...rest}
          asChild={false}
        >
          {children}
        </ChakraDialog.Content>
      </ChakraDialog.Positioner>
    </Portal>
  );
});

export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="sm" ref={ref}>
        {props.children}
      </CloseButton>
    </ChakraDialog.CloseTrigger>
  );
});

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;

// v2 ModalHeader (fontSize xl / semibold / py=4)・ModalBody (py=2) の既定値を再現
export const DialogHeader = (props: ChakraDialog.HeaderProps) => (
  <ChakraDialog.Header
    textStyle="xl"
    fontWeight="semibold"
    pt="4"
    pb="4"
    {...props}
  />
);
export const DialogBody = (props: ChakraDialog.BodyProps) => (
  <ChakraDialog.Body pt="2" pb="2" {...props} />
);
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;
