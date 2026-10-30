import { useCallback } from 'react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import { Heading, Image, List, VStack, Icon } from '@chakra-ui/react';
import { TbDotsVertical } from 'react-icons/tb';
import { useAtom } from 'jotai';
import { tutorialModalAtom } from '@/store/tutorial';

function AddToHomeScreen() {
  const [tutorialModal, setTutorialModal] = useAtom(tutorialModalAtom);
  const onClose = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, ATHS: false })),
    [setTutorialModal],
  );

  return (
    <DialogRoot
      open={tutorialModal.ATHS}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent bg="panel" rounded="xl">
        <DialogHeader>ホーム画面に追加</DialogHeader>
        <DialogCloseTrigger top={4} right={4} />
        <DialogBody>
          <VStack px={4} align="flex-start">
            <Heading size="md">iPhone (Safari)</Heading>
            <List.Root as="ol" ms="1em" gap={4} textStyle="title">
              <List.Item>
                共有メニューを開く
                <Image
                  rounded="lg"
                  shadow="md"
                  src="/AddToHomeScreen/iPhone_1.png"
                  alt="ホーム画面に追加 手順1: 共有メニューを開く"
                />
              </List.Item>
              <List.Item>「ホーム画面に追加」をタップ</List.Item>
              <List.Item>
                「追加」をタップ
                <Image
                  rounded="lg"
                  shadow="md"
                  src="/AddToHomeScreen/iPhone_2.png"
                  alt="ホーム画面に追加 手順3: 追加をタップ"
                />
              </List.Item>
            </List.Root>
            <Heading size="md">Android (Chrome)</Heading>
            <List.Root as="ol" ms="1em" gap={4} textStyle="title">
              <List.Item>
                「<Icon as={TbDotsVertical} />
                」メニューを開く
              </List.Item>
              <List.Item>「インストール」をタップ</List.Item>
            </List.Root>
          </VStack>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}

export default AddToHomeScreen;
