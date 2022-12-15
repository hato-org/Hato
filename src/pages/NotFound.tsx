import { Heading, HStack, VStack, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import BottomNavbar from '@/components/nav/BottomNavbar';
import BackButton from '@/components/layout/BackButton';

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Not Found - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" py={4}>
            404 Not found
          </Heading>
        </HStack>
      </Header>
      <VStack w="100%" pt={4}>
        <Heading>404</Heading>
        <Text textStyle="title">お探しのページは見つかりませんでした。</Text>
        <Button
          variant="ghost"
          textStyle="link"
          // leftIcon={<TbArrowNarrowLeft />}
          color="blue.500"
          as={RouterLink}
          to="/"
        >
          ホームに戻る
        </Button>
      </VStack>
      <BottomNavbar />
    </>
  );
}

export default NotFound;
