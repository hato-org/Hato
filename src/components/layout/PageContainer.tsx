import { Box, Center, Container, Flex, Portal } from '@chakra-ui/react';
import { Suspense } from 'react';
import Loading from '../common/Loading';
import UpdatePrompt from '../common/UpdatePrompt';
import WhatsNew from '../common/WhatsNew';
import AddCardDrawer from '../dashboard/AddCardDrawer';
import BottomNavbar from '../nav/BottomNavbar';
import SideMenu from '../nav/SideMenu';
import Tutorial from '../tutorial';

export default function PageContainer({ children }: { children: JSX.Element }) {
  return (
    <>
      <Portal>
        <UpdatePrompt />
        <Tutorial />
        <WhatsNew />
        <AddCardDrawer />
        <Box hideFrom="md">
          <BottomNavbar />
        </Box>
      </Portal>
      <Container
        maxW={{ base: '100%', md: '640px', lg: '1024px' }}
        display="flex"
        flexDir="row"
        p={0}
      >
        <Flex
          position="sticky"
          flexShrink={0}
          pt={4}
          top={0}
          maxW={72}
          h="100%"
        >
          <SideMenu />
        </Flex>
        <Container
          minH="100vh"
          // v2 Container のデフォルト maxW (60ch)。v3 のデフォルトは 8xl で広すぎる
          maxW="60ch"
          p={0}
          m={0}
          w="100%"
          borderLeftWidth={{ base: '0px', md: '1px' }}
          borderRightWidth={{ base: '0px', md: '1px' }}
          borderColor="border"
        >
          <Suspense
            fallback={
              <Center h="100%">
                <Loading size="lg" />
              </Center>
            }
          >
            {children}
          </Suspense>
        </Container>
      </Container>
    </>
  );
}
