import { useCallback } from 'react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Image } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { tutorialModalAtom } from '@/store/tutorial';

export default function Pin() {
  const [tutorialModal, setTutorialModal] = useAtom(tutorialModalAtom);
  const onClose = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, pin: false })),
    [setTutorialModal],
  );

  return (
    <DialogRoot open={tutorialModal.pin} onOpenChange={(e) => !e.open && (onClose)()}>
      <DialogContent rounded="xl" bg="panel">
        <DialogCloseTrigger top={4} right={4} />
        <DialogHeader>投稿のピン留め</DialogHeader>
        <DialogBody>
          <Image
            src="/pin/pin.gif"
            rounded="lg"
            shadow="md"
            alt="ピン留め操作の説明"
          />
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}
