import React, { Suspense, useCallback } from 'react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';

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
    <DialogRoot open={whatsNew} onOpenChange={(e) => !e.open && (onClose)()} size="xl">
      <DialogContent
        bg="panel"
        top={8}
        shadow="xl"
        rounded="xl"
        className="changelog"
      >
        <DialogCloseTrigger top={4} right={4} />
        <DialogHeader>リリースノート</DialogHeader>
        <DialogBody rounded="lg" overflow="hidden">
          <Suspense fallback={<Loading />}>
            <ChangeLog />
          </Suspense>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}
