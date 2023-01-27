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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRecoilState } from 'recoil';
import { overlayAtom } from '@/store/overlay';
import changelog from '@/../CHANGELOG.md?raw';
import './markdown.css';

export default function WhatsNew() {
  const [{ whatsNew }, setOverlay] = useRecoilState(overlayAtom);

  const onClose = useCallback(() => {
    setOverlay((currVal) => ({ ...currVal, whatsNew: false }));
  }, [setOverlay]);

  return (
    <Modal isOpen={whatsNew} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg" rounded="xl">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>リリースノート</ModalHeader>
        <ModalBody rounded="lg" overflow="hidden">
          {/* <iframe
            style={{ width: '100%', height: '100%', border: 0 }}
            title="What's new Gist"
            src={import.meta.env.VITE_RELEASE_NOTE_URL}
          /> */}
          <ReactMarkdown
            className="changelog"
            components={{
              img: (props) => (
                <Image my={4} rounded="xl" shadow="md" {...props} />
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {changelog}
          </ReactMarkdown>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
