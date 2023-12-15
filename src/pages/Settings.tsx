import { Center, HStack, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';

function Settings() {
  const { pathname } = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <Helmet>
        <title>設定 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" py={4}>
            設定
          </Heading>
        </HStack>
      </Header>
      <AnimatePresence initial={false} mode="popLayout">
        <Center
          key={pathname}
          mb={32}
          pt={4}
          px={8}
          flexDir="column"
          overflow="hidden"
        >
          {outlet}
        </Center>
      </AnimatePresence>
    </>
  );
}

export default Settings;
