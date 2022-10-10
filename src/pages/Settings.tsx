import { Center, HStack, Heading, IconButton } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { TbArrowNarrowLeft } from 'react-icons/tb';
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BottomNavbar from '../components/nav/BottomNavbar';
import Header from '../components/nav/Header';

function Settings() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>設定 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%" px={2}>
          <IconButton
            aria-label="go back"
            icon={<TbArrowNarrowLeft />}
            variant="ghost"
            size="lg"
            isRound
            onClick={() => navigate(-1)}
          />
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
      <BottomNavbar />
    </>
  );
}

export default Settings;
