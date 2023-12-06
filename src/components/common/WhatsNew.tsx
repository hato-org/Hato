import { useCallback } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { overlayAtom } from '@/store/overlay';
import ChangeLog from '@/../CHANGELOG.mdx';
import './markdown.css';

export default function WhatsNew() {
  const [{ whatsNew }, setOverlay] = useAtom(overlayAtom);

  const onClose = useCallback(() => {
    setOverlay((currVal) => ({ ...currVal, whatsNew: false }));
  }, [setOverlay]);

  return (
    <Modal isOpen={whatsNew} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        bg="panel"
        top={8}
        shadow="xl"
        rounded="xl"
        className="changelog"
      >
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>リリースノート</ModalHeader>
        <ModalBody rounded="lg" overflow="hidden">
          <ChangeLog />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
