import {
  Center,
  Container,
  Flex,
  Portal,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Suspense } from 'react';
import Loading from '../common/Loading';
import UpdatePrompt from '../common/UpdatePrompt';
import BottomNavbar from '../nav/BottomNavbar';
import SideMenu from '../nav/SideMenu';
import Tutorial from '../tutorial';

export default function PageContainer({ children }: { children: JSX.Element }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Portal>
        <UpdatePrompt />
        <Tutorial />
        {isMobile && <BottomNavbar />}
      </Portal>
      <Container
        maxW={{ base: '100%', md: 'container.sm', lg: 'container.lg' }}
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
          p={0}
          m={0}
          w="100%"
          borderX="1px solid"
          borderColor={isMobile ? 'transparent' : 'border'}
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
