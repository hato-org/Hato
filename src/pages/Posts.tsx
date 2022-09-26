import { Helmet } from 'react-helmet-async';
import {
  HStack,
  IconButton,
  Heading,
  Center,
  Spacer,
  Link,
} from '@chakra-ui/react';
import { TbExternalLink } from 'react-icons/tb';
import { Outlet } from 'react-router-dom';
import Header from '../components/nav/Header';
import BottomNavbar from '../components/nav/BottomNavbar';

function Posts() {
  return (
    <>
      <Helmet>
        <title>掲示物 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%" px={2}>
          <Heading size="md" ml={4} py={4}>
            はとボード
          </Heading>
          <Spacer />
          <IconButton
            aria-label="open hatoboard"
            icon={<TbExternalLink />}
            size="lg"
            variant="ghost"
            isRound
            as={Link}
            href="https://sites.google.com/g.nagano-c.ed.jp/yashiro-board/"
            isExternal
          />
        </HStack>
      </Header>
      <Center mb={16}>
        <Outlet />
      </Center>
      <BottomNavbar />
    </>
  );
}

export default Posts;
