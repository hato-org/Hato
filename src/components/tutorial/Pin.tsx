import { useCallback } from 'react';
import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { tutorialModalAtom } from '@/store/tutorial';

export default function Pin() {
  const [tutorialModal, setTutorialModal] = useRecoilState(tutorialModalAtom);
  const onClose = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, pin: false })),
    [setTutorialModal]
  );

  return (
    <Modal isOpen={tutorialModal.pin} onClose={onClose}>
      <ModalOverlay />
      <ModalContent rounded="xl" bg="panel">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>投稿のピン留め</ModalHeader>
        <ModalBody>
          <Image src="/pin/pin.gif" rounded="lg" shadow="md" />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
