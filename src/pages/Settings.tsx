import { Center, HStack, Heading, Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';

function Settings() {
  return (
    <Box>
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
      <Center mb={16} p={8} flexDir="column" overflow="hidden">
        <AnimatePresence
          mode="wait"
          // initial
        >
          {/* <MotionCenter
            w="100%"
            initial={{
              // x: "100vw",
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: "100vw",
              opacity: 0,
            }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.4,
            }}
            key={location.pathname}
          > */}
          <Outlet />
          {/* </MotionCenter> */}
        </AnimatePresence>
      </Center>
    </Box>
  );
}

export default Settings;
