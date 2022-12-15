import { Heading, HStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import BottomNavbar from '@/components/nav/BottomNavbar';
import Top from '@/components/library/Top';

export default function Library() {
  return (
    <>
      <Helmet>
        <title>蔵書検索 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            蔵書検索・予約
          </Heading>
        </HStack>
      </Header>
      <Top />
      <BottomNavbar />
    </>
  );
}
