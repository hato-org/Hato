import { VStack, Text, Button, Presence, IconButton } from '@chakra-ui/react';
import { TbX } from 'react-icons/tb';
import { useSetAtom } from 'jotai';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { whatsNewAtom } from '@/store/overlay';

const intervalMS = 1000 * 60 * 1; // 1 min

function UpdatePrompt() {
  const setWhatsNew = useSetAtom(whatsNewAtom);
  const {
    // offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, r) {
      // eslint-disable-next-line no-console
      console.log('Service Worker has been registered: ' + r);

      if (r)
        setInterval(async () => {
          if (!(!r.installing && navigator)) return;

          if ('connection' in navigator && !navigator.onLine) return;

          await r.update();
        }, intervalMS);
    },
    onRegisterError(error) {
      // eslint-disable-next-line no-console
      console.error('SW registration error', error);
    },
  });

  return (
    <Presence
      present={needRefresh}
      position="fixed"
      top={0}
      insetX={0}
      zIndex={10000}
      animationName={{
        _open: 'slide-from-top-full',
        _closed: 'slide-to-top-full',
      }}
      animationDuration="moderate"
    >
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
          onClick={() => setNeedRefresh(false)}
        >{<TbX />}</IconButton>
        <Text textStyle="title">アップデートが利用可能です</Text>
        <Button
          w="100%"
          rounded="lg"
          colorScheme="blue"
          onClick={() => {
            updateServiceWorker();
            setWhatsNew(true);
          }}
        >
          再読み込み
        </Button>
      </VStack>
    </Presence>
  );
}

export default UpdatePrompt;
