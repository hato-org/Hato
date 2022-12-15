import { useCallback } from 'react';
import {
  Heading,
  Image,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  VStack,
  Icon,
  ModalCloseButton,
} from '@chakra-ui/react';
import { TbDotsVertical } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import { tutorialModalAtom } from '@/store/tutorial';

function AddToHomeScreen() {
  const [tutorialModal, setTutorialModal] = useRecoilState(tutorialModalAtom);
  const onClose = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, ATHS: false })),
    [setTutorialModal]
  );

  return (
    <Modal isOpen={tutorialModal.ATHS} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="panel" rounded="xl">
        <ModalHeader>ホーム画面に追加</ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody>
          <VStack px={4} align="flex-start">
            <Heading size="md">iPhone (Safari)</Heading>
            <OrderedList spacing={4} textStyle="title">
              <ListItem>
                共有メニューを開く
                <Image
                  rounded="lg"
                  shadow="md"
                  src="/AddToHomeScreen/iPhone_1.png"
                />
              </ListItem>
              <ListItem>「ホーム画面に追加」をタップ</ListItem>
              <ListItem>
                「追加」をタップ
                <Image
                  rounded="lg"
                  shadow="md"
                  src="/AddToHomeScreen/iPhone_2.png"
                />
              </ListItem>
            </OrderedList>
            <Heading size="md">Android (Chrome)</Heading>
            <OrderedList spacing={4} textStyle="title">
              <ListItem>
                「<Icon as={TbDotsVertical} />
                」メニューを開く
              </ListItem>
              <ListItem>「インストール」をタップ</ListItem>
            </OrderedList>
          </VStack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default AddToHomeScreen;
