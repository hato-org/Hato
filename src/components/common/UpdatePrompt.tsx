import { VStack, Text, Button, Slide, IconButton } from '@chakra-ui/react';
import { TbX } from 'react-icons/tb';
import { useRegisterSW } from 'virtual:pwa-register/react';

function UpdatePrompt() {
  const {
    // offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  return (
    <Slide direction="top" in={needRefresh} style={{ zIndex: 10 }}>
      <VStack
        position="relative"
        bg="whiteAlpha.700"
        m={4}
        p={4}
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
          onClick={() => updateServiceWorker(true)}
        >
          再読み込み
        </Button>
      </VStack>
    </Slide>
  );
}

export default UpdatePrompt;
