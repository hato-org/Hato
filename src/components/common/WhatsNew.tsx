import { lazy, Suspense, useCallback } from 'react';
import {
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import remarkGfm from 'remark-gfm';
import { useRecoilState } from 'recoil';
import { overlayAtom } from '@/store/overlay';
import changelog from '@/../CHANGELOG.md?raw';
import './markdown.css';
import Loading from './Loading';

const ReactMarkdown = lazy(() => import('react-markdown'));

export default function WhatsNew() {
  const [{ whatsNew }, setOverlay] = useRecoilState(overlayAtom);

  const onClose = useCallback(() => {
    setOverlay((currVal) => ({ ...currVal, whatsNew: false }));
  }, [setOverlay]);

  return (
    <Modal isOpen={whatsNew} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="bg" rounded="xl">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>リリースノート</ModalHeader>
        <ModalBody rounded="lg" overflow="hidden">
          <Suspense fallback={<Loading />}>
            <ReactMarkdown
              className="changelog"
              components={{
                img: (props) => (
                  <Image my={4} rounded="xl" shadow="md" {...props} />
                ),
                a: (props) => (
                  <Link isExternal display="inline-block" {...props} />
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {changelog}
            </ReactMarkdown>
          </Suspense>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
