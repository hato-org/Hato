import { Box, Heading, HStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import Search from '@/components/library/Search';

export default function LibrarySearch() {
  return (
    <Box>
      <Helmet>
        <title>蔵書検索 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" ml={2} py={4}>
            蔵書検索・予約
          </Heading>
        </HStack>
      </Header>
      <Search />
    </Box>
  );
}
