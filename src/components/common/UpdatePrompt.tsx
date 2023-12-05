import { VStack, Text, Button, Slide, IconButton } from '@chakra-ui/react';
import { TbX } from 'react-icons/tb';
import { useSetAtom } from 'jotai';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { overlayAtom } from '@/store/overlay';

const intervalMS = 1000 * 60 * 1; // 1 min

function UpdatePrompt() {
  const setOverlay = useSetAtom(overlayAtom);
  const {
    // offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, r) {
      // eslint-disable-next-line prefer-template
      console.log('Service Worker has been registered: ' + r);

      if (r)
        setInterval(async () => {
          if (!(!r.installing && navigator)) return;

          if ('connection' in navigator && !navigator.onLine) return;

          await r.update();
        }, intervalMS);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  return (
    <Slide direction="top" in={needRefresh} style={{ zIndex: 10000 }}>
      <VStack
        position="relative"
        bg="panel"
        m={4}
        p={4}
        border="1px solid"
        borderColor="border"
        shadow={needRefresh ? 'xl' : 'none'}
        rounded="xl"
        transition="all .2s ease"
      >
        <IconButton
          aria-label="Close update prompt"
          variant="ghost"
          position="absolute"
          top={2}
          right={2}
          rounded="lg"
          icon={<TbX />}
          onClick={() => setNeedRefresh(false)}
        />
        <Text textStyle="title">アップデートが利用可能です</Text>
        <Button
          w="100%"
          rounded="lg"
          colorScheme="blue"
          onClick={() => {
            updateServiceWorker();
            setOverlay((currVal) => ({ ...currVal, whatsNew: true }));
          }}
        >
          再読み込み
        </Button>
      </VStack>
    </Slide>
  );
}

export default UpdatePrompt;
