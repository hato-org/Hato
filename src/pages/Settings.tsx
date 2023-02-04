import { Center, HStack, Heading, Box } from '@chakra-ui/react';
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
      <Center mb={32} pt={4} px={8} flexDir="column" overflow="hidden">
        <Outlet />
      </Center>
    </Box>
  );
}

export default Settings;
