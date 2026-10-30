import { Helmet } from 'react-helmet-async';
import {
  HStack,
  IconButton,
  Heading,
  Spacer,
  Link,
  Icon,
} from '@chakra-ui/react';
import { TbExternalLink } from 'react-icons/tb';
import { Outlet } from 'react-router';
import Header from '@/components/nav/Header';

function Posts() {
  return (
    <>
      <Helmet>
        <title>掲示物 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            はとボード
          </Heading>
          <Spacer />
          <IconButton
            aria-label="open hatoboard"
            size="lg"
            variant="ghost"
            borderRadius="full"
            asChild
          >
            <Link
              href="https://sites.google.com/g.nagano-c.ed.jp/yashiro-board/"
              target="_blank"
              rel="noreferrer"
            >
              <Icon as={TbExternalLink} w={6} h={6} />
            </Link>
          </IconButton>
        </HStack>
      </Header>
      <Outlet />
    </>
  );
}

export default Posts;
