import React, { Suspense, useCallback } from 'react';
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
import { whatsNewAtom } from '@/store/overlay';
import Loading from './Loading';
import './markdown.css';

const ChangeLog = React.lazy(() => import('@/../CHANGELOG.mdx'));

export default function WhatsNew() {
  const [whatsNew, setWhatsNew] = useAtom(whatsNewAtom);

  const onClose = useCallback(() => {
    setWhatsNew(false);
  }, [setWhatsNew]);

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
          <Suspense fallback={<Loading />}>
            <ChangeLog />
          </Suspense>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
